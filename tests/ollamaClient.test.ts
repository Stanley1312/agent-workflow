import { afterEach, describe, expect, it, vi } from 'vitest';

const DEFAULT_OLLAMA_HOST = 'http://localhost:11434';
const CUSTOM_OLLAMA_HOST = 'http://127.0.0.1:11435';
const REQUIRED_MODEL_NAME = 'llama3.2-vision';
const TEST_BASE64_IMAGE = 'dGVzdC1pbWFnZS1ieXRlcw==';
const TEST_ANALYSIS_TEXT = 'The image contains a small test scene.';

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

function expectFailureCode(
  result: OllamaReadinessResult | OllamaAnalysisResult,
  code: string,
): void {
  expect(result).toMatchObject({
    error: {
      code,
      message: expect.any(String),
    },
  });
}

function getSingleRequestBody(fetchMock: ReturnType<typeof vi.fn<OllamaClientFetch>>): Record<string, unknown> {
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const requestInit = fetchMock.mock.calls[0]?.[1];
  expect(requestInit?.body).toEqual(expect.any(String));
  return JSON.parse(requestInit?.body as string) as Record<string, unknown>;
}

describe('Ollama client readiness', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should report ready status with the configured host and required model when Ollama has the vision model installed', async () => {
    const fetchMock = createFetchMock(
      createJsonResponse({ models: [{ name: REQUIRED_MODEL_NAME }, { name: 'other-model' }] }),
    );

    const result = await checkReadiness({ fetch: fetchMock, environment: {} });

    expect(fetchMock).toHaveBeenCalledWith(`${DEFAULT_OLLAMA_HOST}/api/tags`, expect.any(Object));
    expect(result).toEqual({
      ready: true,
      host: DEFAULT_OLLAMA_HOST,
      model: REQUIRED_MODEL_NAME,
    });
  });

  it('should report Ollama unavailable without crashing when the readiness tags request cannot connect', async () => {
    const fetchMock = vi.fn<OllamaClientFetch>(async () => {
      throw new TypeError('connection refused');
    });

    const result = await checkReadiness({ fetch: fetchMock, environment: {} });

    expect(fetchMock).toHaveBeenCalledWith(`${DEFAULT_OLLAMA_HOST}/api/tags`, expect.any(Object));
    expect(result).toMatchObject({
      ready: false,
      host: DEFAULT_OLLAMA_HOST,
      model: REQUIRED_MODEL_NAME,
    });
    expectFailureCode(result, 'OLLAMA_UNAVAILABLE');
  });

  it('should report Ollama unavailable without crashing when the readiness tags request fails', async () => {
    const fetchMock = createFetchMock(createJsonResponse({ error: 'daemon unavailable' }, { status: 503 }));

    const result = await checkReadiness({ fetch: fetchMock, environment: {} });

    expect(result).toMatchObject({
      ready: false,
      host: DEFAULT_OLLAMA_HOST,
      model: REQUIRED_MODEL_NAME,
    });
    expectFailureCode(result, 'OLLAMA_UNAVAILABLE');
  });

  it('should report the model unavailable when Ollama is reachable but the required vision model is missing', async () => {
    const fetchMock = createFetchMock(createJsonResponse({ models: [{ name: 'llava' }, { name: 'mistral' }] }));

    const result = await checkReadiness({ fetch: fetchMock, environment: {} });

    expect(result).toMatchObject({
      ready: false,
      host: DEFAULT_OLLAMA_HOST,
      model: REQUIRED_MODEL_NAME,
    });
    expectFailureCode(result, 'MODEL_UNAVAILABLE');
  });

  it('should use the default Ollama host and report it in readiness output when no host override is configured', async () => {
    const fetchMock = createFetchMock(createJsonResponse({ models: [{ name: REQUIRED_MODEL_NAME }] }));

    const result = await checkReadiness({ fetch: fetchMock, environment: {} });

    expect(fetchMock).toHaveBeenCalledWith(`${DEFAULT_OLLAMA_HOST}/api/tags`, expect.any(Object));
    expect(result).toMatchObject({
      host: DEFAULT_OLLAMA_HOST,
    });
  });

  it('should use the Ollama host override and report it in readiness output when OLLAMA_HOST is configured', async () => {
    const fetchMock = createFetchMock(createJsonResponse({ models: [{ name: REQUIRED_MODEL_NAME }] }));

    const result = await checkReadiness({
      fetch: fetchMock,
      environment: { OLLAMA_HOST: CUSTOM_OLLAMA_HOST },
    });

    expect(fetchMock).toHaveBeenCalledWith(`${CUSTOM_OLLAMA_HOST}/api/tags`, expect.any(Object));
    expect(result).toMatchObject({
      ready: true,
      host: CUSTOM_OLLAMA_HOST,
      model: REQUIRED_MODEL_NAME,
    });
  });
});

describe('Ollama client image analysis', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should send exactly one image to the required vision model with streaming disabled when image analysis is requested', async () => {
    const fetchMock = createFetchMock(createJsonResponse({ response: TEST_ANALYSIS_TEXT }));

    const result = await analyzeImage({ fetch: fetchMock, environment: {} });

    expect(fetchMock).toHaveBeenCalledWith(`${DEFAULT_OLLAMA_HOST}/api/generate`, expect.any(Object));
    const requestBody = getSingleRequestBody(fetchMock);
    expect(requestBody).toMatchObject({
      model: REQUIRED_MODEL_NAME,
      stream: false,
      images: [TEST_BASE64_IMAGE],
    });
    expect(requestBody.prompt).toEqual(expect.any(String));
    expect((requestBody.prompt as string).trim()).not.toHaveLength(0);
    expect(result).toEqual({
      ok: true,
      text: TEST_ANALYSIS_TEXT,
      host: DEFAULT_OLLAMA_HOST,
      model: REQUIRED_MODEL_NAME,
    });
  });

  it('should report Ollama unavailable without terminating when the analysis request cannot connect', async () => {
    const fetchMock = vi.fn<OllamaClientFetch>(async () => {
      throw new TypeError('connection refused');
    });

    const result = await analyzeImage({ fetch: fetchMock, environment: {} });

    expect(fetchMock).toHaveBeenCalledWith(`${DEFAULT_OLLAMA_HOST}/api/generate`, expect.any(Object));
    expectFailureCode(result, 'OLLAMA_UNAVAILABLE');
  });

  it('should report the model unavailable when Ollama says the required vision model cannot run analysis', async () => {
    const fetchMock = createFetchMock(
      createJsonResponse({ error: `model ${REQUIRED_MODEL_NAME} not found` }, { status: 404 }),
    );

    const result = await analyzeImage({ fetch: fetchMock, environment: {} });

    expectFailureCode(result, 'MODEL_UNAVAILABLE');
  });

  it('should report a failed Ollama response when image analysis returns a non-model server error', async () => {
    const fetchMock = createFetchMock(createJsonResponse({ error: 'generation failed' }, { status: 500 }));

    const result = await analyzeImage({ fetch: fetchMock, environment: {} });

    expectFailureCode(result, 'OLLAMA_REQUEST_FAILED');
  });

  it('should reject an empty analysis response when Ollama returns successful output without text', async () => {
    const fetchMock = createFetchMock(createJsonResponse({ response: '   ' }));

    const result = await analyzeImage({ fetch: fetchMock, environment: {} });

    expectFailureCode(result, 'EMPTY_ANALYSIS_RESPONSE');
  });
});
