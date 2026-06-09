import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { GhidraClient } from "./ghidra-client.js"

export function registerTools(server: McpServer, client: GhidraClient) {
	server.registerTool(
		"list_methods",
		{
			description: "List all function names in the program with pagination.",
			inputSchema: { offset: z.number().default(0), limit: z.number().default(100) },
		},
		async (args) => {
			const result = await client.safeGet("methods", args)
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"list_classes",
		{
			description: "List all namespace/class names in the program with pagination.",
			inputSchema: { offset: z.number().default(0), limit: z.number().default(100) },
		},
		async (args) => {
			const result = await client.safeGet("classes", args)
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"decompile_function",
		{
			description: "Decompile a specific function by name and return the decompiled C code.",
			inputSchema: { name: z.string() },
		},
		async (args) => {
			const result = await client.safePost("decompile", args.name)
			return { content: [{ type: "text" as const, text: result }] }
		},
	)

	server.registerTool(
		"rename_function",
		{
			description: "Rename a function by its current name to a new user-defined name.",
			inputSchema: { old_name: z.string(), new_name: z.string() },
		},
		async (args) => {
			const result = await client.safePost("renameFunction", {
				oldName: args.old_name,
				newName: args.new_name,
			})
			return { content: [{ type: "text" as const, text: result }] }
		},
	)

	server.registerTool(
		"rename_data",
		{
			description: "Rename a data label at the specified address.",
			inputSchema: { address: z.string(), new_name: z.string() },
		},
		async (args) => {
			const result = await client.safePost("renameData", {
				address: args.address,
				newName: args.new_name,
			})
			return { content: [{ type: "text" as const, text: result }] }
		},
	)

	server.registerTool(
		"list_segments",
		{
			description: "List all memory segments in the program with pagination.",
			inputSchema: { offset: z.number().default(0), limit: z.number().default(100) },
		},
		async (args) => {
			const result = await client.safeGet("segments", args)
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"list_imports",
		{
			description: "List imported symbols in the program with pagination.",
			inputSchema: { offset: z.number().default(0), limit: z.number().default(100) },
		},
		async (args) => {
			const result = await client.safeGet("imports", args)
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"list_exports",
		{
			description: "List exported functions/symbols with pagination.",
			inputSchema: { offset: z.number().default(0), limit: z.number().default(100) },
		},
		async (args) => {
			const result = await client.safeGet("exports", args)
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"list_namespaces",
		{
			description: "List all non-global namespaces in the program with pagination.",
			inputSchema: { offset: z.number().default(0), limit: z.number().default(100) },
		},
		async (args) => {
			const result = await client.safeGet("namespaces", args)
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"list_data_items",
		{
			description: "List defined data labels and their values with pagination.",
			inputSchema: { offset: z.number().default(0), limit: z.number().default(100) },
		},
		async (args) => {
			const result = await client.safeGet("data", args)
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"search_functions_by_name",
		{
			description: "Search for functions whose name contains the given substring.",
			inputSchema: {
				query: z.string(),
				offset: z.number().default(0),
				limit: z.number().default(100),
			},
		},
		async (args) => {
			const result = await client.safeGet("searchFunctions", args)
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"rename_variable",
		{
			description: "Rename a local variable within a function.",
			inputSchema: {
				function_name: z.string(),
				old_name: z.string(),
				new_name: z.string(),
			},
		},
		async (args) => {
			const result = await client.safePost("renameVariable", {
				functionName: args.function_name,
				oldName: args.old_name,
				newName: args.new_name,
			})
			return { content: [{ type: "text" as const, text: result }] }
		},
	)

	server.registerTool(
		"get_function_by_address",
		{
			description: "Get a function by its address.",
			inputSchema: { address: z.string() },
		},
		async (args) => {
			const result = await client.safeGet("get_function_by_address", { address: args.address })
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"get_current_address",
		{
			description: "Get the address currently selected by the user.",
		},
		async () => {
			const result = await client.safeGet("get_current_address")
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"get_current_function",
		{
			description: "Get the function currently selected by the user.",
		},
		async () => {
			const result = await client.safeGet("get_current_function")
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"list_functions",
		{
			description: "List all functions in the database.",
		},
		async () => {
			const result = await client.safeGet("list_functions")
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"decompile_function_by_address",
		{
			description: "Decompile a function at the given address.",
			inputSchema: { address: z.string() },
		},
		async (args) => {
			const result = await client.safeGet("decompile_function", { address: args.address })
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"disassemble_function",
		{
			description: "Get assembly code (address: instruction; comment) for a function.",
			inputSchema: { address: z.string() },
		},
		async (args) => {
			const result = await client.safeGet("disassemble_function", { address: args.address })
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"set_decompiler_comment",
		{
			description: "Set a comment for a given address in the function pseudocode.",
			inputSchema: { address: z.string(), comment: z.string() },
		},
		async (args) => {
			const result = await client.safePost("set_decompiler_comment", {
				address: args.address,
				comment: args.comment,
			})
			return { content: [{ type: "text" as const, text: result }] }
		},
	)

	server.registerTool(
		"set_disassembly_comment",
		{
			description: "Set a comment for a given address in the function disassembly.",
			inputSchema: { address: z.string(), comment: z.string() },
		},
		async (args) => {
			const result = await client.safePost("set_disassembly_comment", {
				address: args.address,
				comment: args.comment,
			})
			return { content: [{ type: "text" as const, text: result }] }
		},
	)

	server.registerTool(
		"rename_function_by_address",
		{
			description: "Rename a function by its address.",
			inputSchema: { function_address: z.string(), new_name: z.string() },
		},
		async (args) => {
			const result = await client.safePost("rename_function_by_address", {
				function_address: args.function_address,
				new_name: args.new_name,
			})
			return { content: [{ type: "text" as const, text: result }] }
		},
	)

	server.registerTool(
		"set_function_prototype",
		{
			description: "Set a function's prototype.",
			inputSchema: { function_address: z.string(), prototype: z.string() },
		},
		async (args) => {
			const result = await client.safePost("set_function_prototype", {
				function_address: args.function_address,
				prototype: args.prototype,
			})
			return { content: [{ type: "text" as const, text: result }] }
		},
	)

	server.registerTool(
		"set_local_variable_type",
		{
			description: "Set a local variable's type.",
			inputSchema: {
				function_address: z.string(),
				variable_name: z.string(),
				new_type: z.string(),
			},
		},
		async (args) => {
			const result = await client.safePost("set_local_variable_type", {
				function_address: args.function_address,
				variable_name: args.variable_name,
				new_type: args.new_type,
			})
			return { content: [{ type: "text" as const, text: result }] }
		},
	)

	server.registerTool(
		"get_xrefs_to",
		{
			description: "Get all references to the specified address (xref to).",
			inputSchema: {
				address: z.string(),
				offset: z.number().default(0),
				limit: z.number().default(100),
			},
		},
		async (args) => {
			const result = await client.safeGet("xrefs_to", args)
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"get_xrefs_from",
		{
			description: "Get all references from the specified address (xref from).",
			inputSchema: {
				address: z.string(),
				offset: z.number().default(0),
				limit: z.number().default(100),
			},
		},
		async (args) => {
			const result = await client.safeGet("xrefs_from", args)
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"get_function_xrefs",
		{
			description: "Get all references to the specified function by name.",
			inputSchema: {
				name: z.string(),
				offset: z.number().default(0),
				limit: z.number().default(100),
			},
		},
		async (args) => {
			const result = await client.safeGet("function_xrefs", args)
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)

	server.registerTool(
		"list_strings",
		{
			description: "List all defined strings in the program with their addresses.",
			inputSchema: {
				offset: z.number().default(0),
				limit: z.number().default(2000),
				filter: z.string().optional(),
			},
		},
		async (args) => {
			const result = await client.safeGet("strings", args)
			return { content: [{ type: "text" as const, text: result.join("\n") }] }
		},
	)
}
