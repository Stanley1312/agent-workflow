import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import {
  ANALYZE_IMAGE_TOOL_NAME,
  analyzeImageToolHandler,
  analyzeImageToolInputSchema,
  analyzeImageToolJsonSchema,
} from './tools/analyzeImage.js';
import {
  CHECK_READINESS_TOOL_NAME,
  checkOllamaReadinessToolHandler,
  checkReadinessToolInputSchema,
  checkReadinessToolJsonSchema,
} from './tools/checkReadiness.js';

const SERVER_NAME = 'vision-mcp-server-ollama';
const SERVER_VERSION = '0.1.0';
const REQUIRED_MODEL_NAME = 'llama3.2-vision';

export interface JsonSchemaStringProperty {
  type: 'string';
  description: string;
  minLength?: number;
}

export interface ToolInputSchema {
  type: 'object';
  additionalProperties: false;
  required?: readonly string[];
  properties: Readonly<Record<string, JsonSchemaStringProperty>>;
}

export interface RegisteredToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
}

export const REGISTERED_TOOL_DEFINITIONS: readonly RegisteredToolDefinition[] = [
  {
    name: ANALYZE_IMAGE_TOOL_NAME,
    description: `Analyze one local image file with Ollama ${REQUIRED_MODEL_NAME}.`,
    inputSchema: analyzeImageToolJsonSchema,
  },
  {
    name: CHECK_READINESS_TOOL_NAME,
    description: `Check Ollama connectivity and confirm ${REQUIRED_MODEL_NAME} is installed locally.`,
    inputSchema: checkReadinessToolJsonSchema,
  },
];

export function getRegisteredToolDefinitions(): RegisteredToolDefinition[] {
  return REGISTERED_TOOL_DEFINITIONS.map((toolDefinition) => ({
    ...toolDefinition,
    inputSchema: {
      ...toolDefinition.inputSchema,
      properties: { ...toolDefinition.inputSchema.properties },
      required: toolDefinition.inputSchema.required,
    },
  }));
}

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  registerToolShells(server);

  return server;
}

export async function startStdioServer(): Promise<void> {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

function registerToolShells(server: McpServer): void {
  server.registerTool(
    ANALYZE_IMAGE_TOOL_NAME,
    {
      description: `Analyze one local image file with Ollama ${REQUIRED_MODEL_NAME}.`,
      inputSchema: analyzeImageToolInputSchema,
    },
    async (input) => analyzeImageToolHandler(input),
  );

  server.registerTool(
    CHECK_READINESS_TOOL_NAME,
    {
      description: `Check Ollama connectivity and confirm ${REQUIRED_MODEL_NAME} is installed locally.`,
      inputSchema: checkReadinessToolInputSchema,
    },
    async () => checkOllamaReadinessToolHandler({}),
  );
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  startStdioServer().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Failed to start MCP server: ${message}\n`);
    process.exitCode = 1;
  });
}
