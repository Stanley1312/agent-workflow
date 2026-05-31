import { afterEach, describe, expect, it, vi } from 'vitest';

const DEFAULT_OLLAMA_HOST = 'http://localhost:11434';
const DEFAULT_VISION_MODEL = 'llama3.2-vision';
const CONFIGURED_VISION_MODEL = 'llava:latest';
const TEST_BASE64_IMAGE = 'dGVzdC1pbWFnZS1ieXRlcw==';
const TEST_ANALYSIS_TEXT = 'The configured model analyzed the image.';
const MODEL_ENVIRONMENT_VARIABLE = 'OLLAMA_VISION_MODEL';

type OllamaClientFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

type OllamaClientDependencies = {
  fetch?: OllamaClientFetch;
  environment?: NodeJS.ProcessEnv;
};

type OllamaReadinessSuccess = {
  ready: true;
  host: string;
  model: string;
};

type OllamaReadinessFailure = {
  ready: false;
  host: string;
  model: string;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

type OllamaReadinessResult = OllamaReadinessSuccess | OllamaReadinessFailure;

type OllamaAnalysisSuccess = {
  ok: true;
  text: string;
  host: string;
  model: string;
};

type OllamaAnalysisFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

type OllamaAnalysisResult = OllamaAnalysisSuccess | OllamaAnalysisFailure;

type CheckOllamaReadiness = (dependencies?: OllamaClientDependencies) => Promise<OllamaReadinessResult>;
type AnalyzeImageWithOllama = (
  input: { base64Image: string },
  dependencies?: OllamaClientDependencies,
) => Promise<OllamaAnalysisResult>;

async function checkReadiness(dependencies?: OllamaClientDependencies): Promise<OllamaReadinessResult> {
  const module = (await import('../src/services/ollamaClient.js')) as {
    checkOllamaReadiness: CheckOllamaReadiness;
  };

  return module.checkOllamaReadiness(dependencies);
}

async function analyzeImage(dependencies?: OllamaClientDependencies): Promise<OllamaAnalysisResult> {
  const module = (await import('../src/services/ollamaClient.js')) as {
    analyzeImageWithOllama: AnalyzeImageWithOllama;
  };

  return module.analyzeImageWithOllama({ base64Image: TEST_BASE64_IMAGE }, dependencies);
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

function createFetchMock(response: Response): ReturnType<typeof vi.fn<OllamaClientFetch>> {
  return vi.fn<OllamaClientFetch>(async () => response);
}

function getSingleRequestBody(fetchMock: ReturnType<typeof vi.fn<OllamaClientFetch>>): Record<string, unknown> {
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const requestInit = fetchMock.mock.calls[0]?.[1];
  expect(requestInit?.body).toEqual(expect.any(String));
  return JSON.parse(requestInit?.body as string) as Record<string, unknown>;
}

function expectInvalidModelConfiguration(result: OllamaReadinessResult | OllamaAnalysisResult): void {
  expect(result).toMatchObject({
    error: {
      code: 'INVALID_MODEL_CONFIGURATION',
      message: expect.stringContaining(MODEL_ENVIRONMENT_VARIABLE),
      details: expect.objectContaining({
        environmentVariable: MODEL_ENVIRONMENT_VARIABLE,
      }),
    },
  });
}

describe('Ollama model configuration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should use the documented default model when the model environment variable is absent', async () => {
    const fetchMock = createFetchMock(createJsonResponse({ models: [{ name: DEFAULT_VISION_MODEL }] }));

    const result = await checkReadiness({ fetch: fetchMock, environment: {} });

    expect(fetchMock).toHaveBeenCalledWith(`${DEFAULT_OLLAMA_HOST}/api/tags`, expect.any(Object));
    expect(result).toEqual({
      ready: true,
      host: DEFAULT_OLLAMA_HOST,
      model: DEFAULT_VISION_MODEL,
    });
  });

  it('should validate the configured model when the documented model environment variable is set', async () => {
    const fetchMock = createFetchMock(createJsonResponse({ models: [{ name: CONFIGURED_VISION_MODEL }] }));

    const result = await checkReadiness({
      fetch: fetchMock,
      environment: { [MODEL_ENVIRONMENT_VARIABLE]: CONFIGURED_VISION_MODEL },
    });

    expect(fetchMock).toHaveBeenCalledWith(`${DEFAULT_OLLAMA_HOST}/api/tags`, expect.any(Object));
    expect(result).toEqual({
      ready: true,
      host: DEFAULT_OLLAMA_HOST,
      model: CONFIGURED_VISION_MODEL,
    });
  });

  it('should send analysis requests to the configured model when the documented model environment variable is set', async () => {
    const fetchMock = createFetchMock(createJsonResponse({ response: TEST_ANALYSIS_TEXT }));

    const result = await analyzeImage({
      fetch: fetchMock,
      environment: { [MODEL_ENVIRONMENT_VARIABLE]: CONFIGURED_VISION_MODEL },
    });

    expect(fetchMock).toHaveBeenCalledWith(`${DEFAULT_OLLAMA_HOST}/api/generate`, expect.any(Object));
    expect(getSingleRequestBody(fetchMock)).toMatchObject({
      model: CONFIGURED_VISION_MODEL,
      stream: false,
      images: [TEST_BASE64_IMAGE],
    });
    expect(result).toEqual({
      ok: true,
      text: TEST_ANALYSIS_TEXT,
      host: DEFAULT_OLLAMA_HOST,
      model: CONFIGURED_VISION_MODEL,
    });
  });

  it('should trim the configured model before readiness validation and analysis requests', async () => {
    const readinessFetchMock = createFetchMock(createJsonResponse({ models: [{ name: CONFIGURED_VISION_MODEL }] }));
    const analysisFetchMock = createFetchMock(createJsonResponse({ response: TEST_ANALYSIS_TEXT }));
    const environment = { [MODEL_ENVIRONMENT_VARIABLE]: `  ${CONFIGURED_VISION_MODEL}  ` };

    const readinessResult = await checkReadiness({ fetch: readinessFetchMock, environment });
    const analysisResult = await analyzeImage({ fetch: analysisFetchMock, environment });

    expect(readinessResult).toEqual({
      ready: true,
      host: DEFAULT_OLLAMA_HOST,
      model: CONFIGURED_VISION_MODEL,
    });
    expect(getSingleRequestBody(analysisFetchMock)).toMatchObject({
      model: CONFIGURED_VISION_MODEL,
    });
    expect(analysisResult).toMatchObject({
      ok: true,
      model: CONFIGURED_VISION_MODEL,
    });
  });

  it('should reject empty and whitespace-only model configuration before calling Ollama', async () => {
    const emptyModelFetchMock = createFetchMock(createJsonResponse({ models: [{ name: DEFAULT_VISION_MODEL }] }));
    const whitespaceModelFetchMock = createFetchMock(createJsonResponse({ response: TEST_ANALYSIS_TEXT }));

    const emptyModelResult = await checkReadiness({
      fetch: emptyModelFetchMock,
      environment: { [MODEL_ENVIRONMENT_VARIABLE]: '' },
    });
    const whitespaceModelResult = await analyzeImage({
      fetch: whitespaceModelFetchMock,
      environment: { [MODEL_ENVIRONMENT_VARIABLE]: '   ' },
    });

    expect(emptyModelFetchMock).not.toHaveBeenCalled();
    expect(whitespaceModelFetchMock).not.toHaveBeenCalled();
    expectInvalidModelConfiguration(emptyModelResult);
    expectInvalidModelConfiguration(whitespaceModelResult);
  });
});
