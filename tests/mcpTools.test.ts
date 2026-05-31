import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createStructuredToolErrorResponse } from '../src/errors.js';
import { getRegisteredToolDefinitions } from '../src/server.js';

const ANALYZE_IMAGE_TOOL_NAME = 'analyze_image';
const READINESS_TOOL_NAME = 'check_ollama_readiness';
const REQUIRED_MODEL_NAME = 'llama3.2-vision';
const DEFAULT_OLLAMA_HOST = 'http://localhost:11434';
const TEMPORARY_MCP_TOOL_DIRECTORY = '/home/dudu/Workspace/projects/agent-workflow/tests/.tmp-mcp-tools';
const TEST_IMAGE_BYTES = Buffer.from('valid png test bytes');
const TEST_IMAGE_BASE64 = TEST_IMAGE_BYTES.toString('base64');
const TEST_ANALYSIS_TEXT = 'A concise description of the local image.';

type ToolTextResponse = {
  isError?: boolean;
  content: Array<{
    type: 'text';
    text: string;
  }>;
};

type McpToolFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

type McpToolDependencies = {
  fetch?: McpToolFetch;
  environment?: NodeJS.ProcessEnv;
  fileSystem?: {
    stat: (filePath: string) => Promise<{ isFile: () => boolean }>;
    readFile: (filePath: string) => Promise<Buffer>;
  };
};

type CheckReadinessToolHandler = (
  input?: Record<string, never>,
  dependencies?: McpToolDependencies,
) => Promise<ToolTextResponse>;

type AnalyzeImageToolHandler = (
  input: { imagePath: string },
  dependencies?: McpToolDependencies,
) => Promise<ToolTextResponse>;

type ValidationCase = {
  name: string;
  imagePath: string;
  expectedCode: string;
  prepare?: () => Promise<McpToolDependencies | undefined>;
};

async function callReadinessTool(dependencies?: McpToolDependencies): Promise<ToolTextResponse> {
  const module = (await import('../src/tools/checkReadiness.js')) as {
    checkOllamaReadinessToolHandler: CheckReadinessToolHandler;
  };

  return module.checkOllamaReadinessToolHandler({}, dependencies);
}

async function callAnalyzeImageTool(
  imagePath: string,
  dependencies?: McpToolDependencies,
): Promise<ToolTextResponse> {
  const module = (await import('../src/tools/analyzeImage.js')) as {
    analyzeImageToolHandler: AnalyzeImageToolHandler;
  };

  return module.analyzeImageToolHandler({ imagePath }, dependencies);
}

function createJsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      'content-type': 'application/json',
      ...init.headers,
    },
  });
}

function createFetchMock(response: Response): ReturnType<typeof vi.fn<McpToolFetch>> {
  return vi.fn<McpToolFetch>(async () => response);
}

function parseToolText(response: ToolTextResponse): unknown {
  expect(response.content).toHaveLength(1);
  expect(response.content[0]).toMatchObject({ type: 'text' });
  return JSON.parse(response.content[0]?.text ?? '');
}

function expectStructuredToolError(response: ToolTextResponse, code: string): void {
  expect(response.isError).toBe(true);
  expect(parseToolText(response)).toMatchObject({
    error: {
      code,
      message: expect.any(String),
    },
  });
}

function getSingleRequestBody(fetchMock: ReturnType<typeof vi.fn<McpToolFetch>>): Record<string, unknown> {
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const requestInit = fetchMock.mock.calls[0]?.[1];
  expect(requestInit?.body).toEqual(expect.any(String));
  return JSON.parse(requestInit?.body as string) as Record<string, unknown>;
}

describe('MCP tool discovery', () => {
  it('should list image analysis and Ollama readiness tools when Claude Code discovers available tools', () => {
    const tools = getRegisteredToolDefinitions();

    expect(tools).toHaveLength(2);
    expect(tools.map((tool) => tool.name).sort()).toEqual([
      ANALYZE_IMAGE_TOOL_NAME,
      READINESS_TOOL_NAME,
    ]);
  });

  it('should expose stable descriptions and input schemas when Claude Code inspects the domain tools', () => {
    const tools = getRegisteredToolDefinitions();
    const analyzeImageTool = tools.find((tool) => tool.name === ANALYZE_IMAGE_TOOL_NAME);
    const readinessTool = tools.find((tool) => tool.name === READINESS_TOOL_NAME);

    expect(analyzeImageTool).toMatchObject({
      name: ANALYZE_IMAGE_TOOL_NAME,
      description: `Analyze one local image file with Ollama ${REQUIRED_MODEL_NAME}.`,
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        required: ['imagePath'],
        properties: {
          imagePath: {
            type: 'string',
            description: 'Local filesystem path to one readable image file.',
            minLength: 1,
          },
        },
      },
    });

    expect(readinessTool).toMatchObject({
      name: READINESS_TOOL_NAME,
      description: `Check Ollama connectivity and confirm ${REQUIRED_MODEL_NAME} is installed locally.`,
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {},
      },
    });
  });
});

describe('MCP structured error responses', () => {
  it('should return stable structured error content when a tool reports a failure', () => {
    const response = createStructuredToolErrorResponse({
      code: 'OLLAMA_UNAVAILABLE',
      message: 'Ollama is not reachable.',
      details: {
        host: 'http://localhost:11434',
        guidance: 'Start Ollama and try again.',
      },
    });

    expect(response).toEqual({
      isError: true,
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: {
              code: 'OLLAMA_UNAVAILABLE',
              message: 'Ollama is not reachable.',
              details: {
                host: 'http://localhost:11434',
                guidance: 'Start Ollama and try again.',
              },
            },
          }),
        },
      ],
    });
  });
});

describe('MCP readiness tool', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return ready content with the configured host and required model when Ollama has the vision model installed', async () => {
    const fetchMock = createFetchMock(createJsonResponse({ models: [{ name: REQUIRED_MODEL_NAME }] }));

    const response = await callReadinessTool({ fetch: fetchMock, environment: {} });

    expect(response.isError).toBeUndefined();
    expect(parseToolText(response)).toEqual({
      ready: true,
      host: DEFAULT_OLLAMA_HOST,
      model: REQUIRED_MODEL_NAME,
    });
  });

  it('should return a not-ready Ollama unavailable error without crashing when Ollama cannot be reached', async () => {
    const fetchMock = vi.fn<McpToolFetch>(async () => {
      throw new TypeError('connection refused');
    });

    const response = await callReadinessTool({ fetch: fetchMock, environment: {} });

    expectStructuredToolError(response, 'OLLAMA_UNAVAILABLE');
    expect(parseToolText(response)).toMatchObject({
      error: {
        details: {
          ready: false,
          host: DEFAULT_OLLAMA_HOST,
          model: REQUIRED_MODEL_NAME,
        },
      },
    });
  });

  it('should return a not-ready model unavailable error when Ollama lacks the required vision model', async () => {
    const fetchMock = createFetchMock(createJsonResponse({ models: [{ name: 'llava' }] }));

    const response = await callReadinessTool({ fetch: fetchMock, environment: {} });

    expectStructuredToolError(response, 'MODEL_UNAVAILABLE');
    expect(parseToolText(response)).toMatchObject({
      error: {
        details: {
          ready: false,
          host: DEFAULT_OLLAMA_HOST,
          model: REQUIRED_MODEL_NAME,
        },
      },
    });
  });
});

describe('MCP image analysis tool', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    await rm(TEMPORARY_MCP_TOOL_DIRECTORY, { recursive: true, force: true });
    await mkdir(TEMPORARY_MCP_TOOL_DIRECTORY, { recursive: true });
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(TEMPORARY_MCP_TOOL_DIRECTORY, { recursive: true, force: true });
  });

  it('should load a valid local image, call Ollama once, and return non-empty plain text analysis when image analysis succeeds', async () => {
    const imagePath = join(TEMPORARY_MCP_TOOL_DIRECTORY, 'valid-image.png');
    await writeFile(imagePath, TEST_IMAGE_BYTES);
    const fetchMock = createFetchMock(createJsonResponse({ response: TEST_ANALYSIS_TEXT }));

    const response = await callAnalyzeImageTool(imagePath, { fetch: fetchMock, environment: {} });

    expect(response).toEqual({
      content: [
        {
          type: 'text',
          text: TEST_ANALYSIS_TEXT,
        },
      ],
    });
    const requestBody = getSingleRequestBody(fetchMock);
    expect(requestBody).toMatchObject({
      model: REQUIRED_MODEL_NAME,
      stream: false,
      images: [TEST_IMAGE_BASE64],
    });
  });

  it.each<ValidationCase>([
    {
      name: 'empty image paths',
      imagePath: '',
      expectedCode: 'INVALID_IMAGE_PATH',
    },
    {
      name: 'malformed image paths',
      imagePath: `${TEMPORARY_MCP_TOOL_DIRECTORY}/unsafe\0.png`,
      expectedCode: 'INVALID_IMAGE_PATH',
    },
    {
      name: 'missing image files',
      imagePath: join(TEMPORARY_MCP_TOOL_DIRECTORY, 'missing.png'),
      expectedCode: 'IMAGE_NOT_FOUND',
    },
    {
      name: 'directory image paths',
      imagePath: join(TEMPORARY_MCP_TOOL_DIRECTORY, 'image-directory.png'),
      expectedCode: 'IMAGE_NOT_FILE',
      prepare: async () => {
        await mkdir(join(TEMPORARY_MCP_TOOL_DIRECTORY, 'image-directory.png'));
        return undefined;
      },
    },
    {
      name: 'unreadable image files',
      imagePath: join(TEMPORARY_MCP_TOOL_DIRECTORY, 'unreadable.png'),
      expectedCode: 'IMAGE_UNREADABLE',
      prepare: async () => ({
        fileSystem: {
          stat: vi.fn(async () => ({ isFile: () => true })),
          readFile: vi.fn(async () => {
            const error = new Error('permission denied') as NodeJS.ErrnoException;
            error.code = 'EACCES';
            throw error;
          }),
        },
      }),
    },
    {
      name: 'unsupported image types',
      imagePath: join(TEMPORARY_MCP_TOOL_DIRECTORY, 'notes.txt'),
      expectedCode: 'UNSUPPORTED_IMAGE_TYPE',
      prepare: async () => {
        await writeFile(join(TEMPORARY_MCP_TOOL_DIRECTORY, 'notes.txt'), 'not an image');
        return undefined;
      },
    },
  ])('should return structured validation errors without calling Ollama when Claude Code submits $name', async (testCase) => {
    const preparedDependencies = await testCase.prepare?.();
    const fetchMock = vi.fn<McpToolFetch>(async () => createJsonResponse({ response: TEST_ANALYSIS_TEXT }));

    const response = await callAnalyzeImageTool(testCase.imagePath, {
      ...preparedDependencies,
      fetch: fetchMock,
      environment: {},
    });

    expectStructuredToolError(response, testCase.expectedCode);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should return a structured Ollama unavailable error without terminating when analysis cannot reach Ollama', async () => {
    const imagePath = join(TEMPORARY_MCP_TOOL_DIRECTORY, 'valid-image.png');
    await writeFile(imagePath, TEST_IMAGE_BYTES);
    const fetchMock = vi.fn<McpToolFetch>(async () => {
      throw new TypeError('connection refused');
    });

    const response = await callAnalyzeImageTool(imagePath, { fetch: fetchMock, environment: {} });

    expectStructuredToolError(response, 'OLLAMA_UNAVAILABLE');
  });

  it('should return a structured Ollama request error without terminating when analysis fails after local image validation', async () => {
    const imagePath = join(TEMPORARY_MCP_TOOL_DIRECTORY, 'valid-image.png');
    await writeFile(imagePath, TEST_IMAGE_BYTES);
    const fetchMock = createFetchMock(createJsonResponse({ error: 'generation failed' }, { status: 500 }));

    const response = await callAnalyzeImageTool(imagePath, { fetch: fetchMock, environment: {} });

    expectStructuredToolError(response, 'OLLAMA_REQUEST_FAILED');
  });

  it('should return an empty analysis response error when Ollama succeeds without analysis text', async () => {
    const imagePath = join(TEMPORARY_MCP_TOOL_DIRECTORY, 'valid-image.png');
    await writeFile(imagePath, TEST_IMAGE_BYTES);
    const fetchMock = createFetchMock(createJsonResponse({ response: '   ' }));

    const response = await callAnalyzeImageTool(imagePath, { fetch: fetchMock, environment: {} });

    expectStructuredToolError(response, 'EMPTY_ANALYSIS_RESPONSE');
  });
});
