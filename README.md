# Pollinations Canvas MCP Server 🎨

[![Made with pollinations.ai](https://raw.githubusercontent.com/pollinations/pollinations/main/packages/ui/src/brand/badge-made-with.svg)](https://pollinations.ai/?ref=badge)

Fixes #17689

A Model Context Protocol (MCP) server that grants **Pollinations Agents** and coding assistants procedural canvas layout calculation and sprite prompt synthesis abilities.

## 🛠️ Provided Tools
1. `compose_layout`: Automatically computes isometric and rectangular cell positioning for asset spritesheets.
2. `generate_sprite_prompt`: Transforms raw concepts into prompt structures with high visual fidelity on `tongyi-mai/z-image-turbo` and `flux`.

## 🚀 How to Run
```bash
npm install
npm start
```

Connect in `claude_desktop_config.json` or with `polli mcp`:
```json
{
  "mcpServers": {
    "pollinations-canvas": {
      "command": "node",
      "args": ["/path/to/pollinations-canvas-mcp/index.js"]
    }
  }
}
```

## 📄 License
MIT License
