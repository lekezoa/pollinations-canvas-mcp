// Model Context Protocol (MCP) Server for Pollinations
// Provides canvas rendering, image composition, and visual inspection tools for Pollinations Agents

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "pollinations-canvas-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Available Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "compose_layout",
        description: "Calculate bounding boxes and layout positioning for multi-element AI image generation grids.",
        inputSchema: {
          type: "object",
          properties: {
            elements: {
              type: "array",
              items: { type: "string" },
              description: "List of visual asset names to lay out",
            },
            gridWidth: { type: "number", default: 1024 },
            gridHeight: { type: "number", default: 1024 },
          },
          required: ["elements"],
        },
      },
      {
        name: "generate_sprite_prompt",
        description: "Optimizes user ideas into high-adherence sprite prompts for Pollinations image generation models.",
        inputSchema: {
          type: "object",
          properties: {
            subject: { type: "string", description: "Character or item description" },
            style: { type: "string", enum: ["8-bit", "16-bit", "isometric", "vector"], default: "16-bit" },
          },
          required: ["subject"],
        },
      },
    ],
  };
});

// Tool Handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "compose_layout") {
    const { elements, gridWidth = 1024, gridHeight = 1024 } = args;
    const cols = Math.ceil(Math.sqrt(elements.length));
    const rows = Math.ceil(elements.length / cols);
    const cellW = Math.floor(gridWidth / cols);
    const cellH = Math.floor(gridHeight / rows);

    const layout = elements.map((item, idx) => ({
      item,
      x: (idx % cols) * cellW,
      y: Math.floor(idx / cols) * cellH,
      width: cellW,
      height: cellH,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ grid: { cols, rows, cellW, cellH }, layout }, null, 2),
        },
      ],
    };
  }

  if (name === "generate_sprite_prompt") {
    const { subject, style = "16-bit" } = args;
    const prompt = `${subject}, ${style} pixel art game asset, clean isolated sprite on solid background, centered, sharp pixel clustering`;
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ optimizedPrompt: prompt, model: "tongyi-mai/z-image-turbo" }, null, 2),
        },
      ],
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((err) => {
  console.error("Fatal error running MCP server:", err);
  process.exit(1);
});
