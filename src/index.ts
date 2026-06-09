#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { GhidraClient } from "./ghidra-client.js"
import { registerTools } from "./tools.js"
import { parseArgs } from "node:util"
import http from "node:http"
import type { IncomingMessage, ServerResponse } from "node:http"

const USAGE = `ghidra-mcp — MCP server for Ghidra

Usage:
  ghidra-mcp --server <url> [--sse <port>]

Required:
  --server <url>              Ghidra HTTP server URL

Options:
  --sse <port>                Enable SSE transport on the given port
  --help                      Show this help message

Examples:
  ghidra-mcp --server http://127.0.0.1:17591/              # stdio mode
  ghidra-mcp --server http://127.0.0.1:17591/ --sse 17592  # SSE mode
`

const { values: args } = parseArgs({
	options: {
		server: { type: "string" },
		sse: { type: "string" },
		help: { type: "boolean", default: false },
	},
})

if (args.help) {
	process.stdout.write(USAGE)
	process.exit(0)
}

if (!args.server) {
	process.stderr.write("Error: --server is required\n\n")
	process.stderr.write(USAGE)
	process.exit(1)
}

const ghidraUrl = args.server
const ssePort = args.sse ? Number(args.sse) : undefined

const client = new GhidraClient(ghidraUrl)
const server = new McpServer({
	name: "ghidra-mcp",
	version: "1.0.0",
})

registerTools(server, client)

async function readBody(req: IncomingMessage): Promise<string> {
	let body = ""
	for await (const chunk of req) {
		body += typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk)
	}
	return body
}

if (ssePort !== undefined) {
	process.stderr.write(`Ghidra server: ${ghidraUrl}\n`)
	process.stderr.write(`MCP SSE server starting on http://127.0.0.1:${ssePort}\n`)

	let currentTransport: SSEServerTransport | undefined

	const httpServer = http.createServer(
		async (req: IncomingMessage, res: ServerResponse) => {
			if (req.method === "GET" && req.url?.startsWith("/sse")) {
				if (currentTransport) {
					await currentTransport.close()
					currentTransport = undefined
				}
				const transport = new SSEServerTransport("/messages", res)
				currentTransport = transport
				res.on("close", () => {
					if (currentTransport === transport) {
						currentTransport = undefined
					}
				})
				await server.connect(transport)
			} else if (req.method === "POST" && req.url?.startsWith("/messages")) {
				if (!currentTransport) {
					res.writeHead(400, { "Content-Type": "text/plain" })
					res.end("No active SSE connection")
					return
				}
				try {
					const body = await readBody(req)
					const parsed: unknown = body ? JSON.parse(body) : undefined
					await currentTransport.handlePostMessage(req, res, parsed)
				} catch {
					res.writeHead(400, { "Content-Type": "text/plain" })
					res.end("Invalid request body")
				}
			} else {
				res.writeHead(404, { "Content-Type": "text/plain" })
				res.end("Not Found")
			}
		},
	)

	httpServer.listen(ssePort, "127.0.0.1")

	process.on("SIGINT", async () => {
		if (currentTransport) await currentTransport.close()
		await server.close()
		httpServer.close()
		process.exit(0)
	})
} else {
	const transport = new StdioServerTransport()
	await server.connect(transport)

	process.on("SIGINT", async () => {
		await server.close()
		process.exit(0)
	})
}
