# Ghidra MCP

Ghidra MCP compatible with [LaurieWired/GhidraMCP](https://github.com/LaurieWired/GhidraMCP).

This is a simple TypeScript implementation of Ghidra MCP, which alternates the [python script](https://github.com/LaurieWired/GhidraMCP/blob/main/bridge_mcp_ghidra.py) in the original repo.

## Usage
```
ghidra-mcp — MCP server for Ghidra

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
```

