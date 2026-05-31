import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';

export const ERROR_CODES = {
  INVALID_IMAGE_PATH: 'INVALID_IMAGE_PATH',
  IMAGE_NOT_FOUND: 'IMAGE_NOT_FOUND',
  IMAGE_NOT_FILE: 'IMAGE_NOT_FILE',
  IMAGE_UNREADABLE: 'IMAGE_UNREADABLE',
  UNSUPPORTED_IMAGE_TYPE: 'UNSUPPORTED_IMAGE_TYPE',
  OLLAMA_UNAVAILABLE: 'OLLAMA_UNAVAILABLE',
  MODEL_UNAVAILABLE: 'MODEL_UNAVAILABLE',
  OLLAMA_REQUEST_FAILED: 'OLLAMA_REQUEST_FAILED',
  EMPTY_ANALYSIS_RESPONSE: 'EMPTY_ANALYSIS_RESPONSE',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type ToolErrorDetails = Record<string, unknown>;

export interface ToolErrorInput {
  code: ErrorCode;
  message: string;
  details?: ToolErrorDetails;
}

export type ToolTextContent = TextContent & {
  type: 'text';
  text: string;
};

export type ToolTextResponse = CallToolResult & {
  content: ToolTextContent[];
  isError?: boolean;
};

export type StructuredToolErrorResponse = ToolTextResponse & {
  isError: true;
};

interface SerializedToolError {
  error: {
    code: ErrorCode;
    message: string;
    details?: ToolErrorDetails;
  };
}

export function createPlainTextToolResponse(text: string): ToolTextResponse {
  return {
    content: [createTextContent(text)],
  };
}

export function createJsonToolResponse(body: Record<string, unknown>): ToolTextResponse {
  return createPlainTextToolResponse(JSON.stringify(body));
}

export function createStructuredToolErrorResponse(error: ToolErrorInput): StructuredToolErrorResponse {
  return {
    isError: true,
    content: [createTextContent(JSON.stringify(createSerializedToolError(error)))],
  };
}

function createTextContent(text: string): ToolTextContent {
  return {
    type: 'text',
    text,
  };
}

function createSerializedToolError(error: ToolErrorInput): SerializedToolError {
  if (error.details === undefined) {
    return {
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }

  return {
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
    },
  };
}
