import { ERROR_CODES, type ErrorCode } from '../errors.js';

const DEFAULT_OLLAMA_HOST = 'http://localhost:11434';
const DEFAULT_VISION_MODEL = 'llama3.2-vision';
const OLLAMA_VISION_MODEL_ENVIRONMENT_VARIABLE = 'OLLAMA_VISION_MODEL';
const ANALYSIS_PROMPT = 'Analyze this image and describe the important visual details.';
const MODEL_ERROR_STATUS = 404;

export type OllamaClientFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export interface OllamaClientDependencies {
  fetch?: OllamaClientFetch;
  environment?: NodeJS.ProcessEnv;
}

export interface OllamaReadinessSuccess {
  ready: true;
  host: string;
  model: string;
  configuration?: {
    environmentVariable: typeof OLLAMA_VISION_MODEL_ENVIRONMENT_VARIABLE;
    defaulted: boolean;
  };
}

export interface OllamaReadinessFailure {
  ready: false;
  host: string;
  model: string;
  error: OllamaClientError;
}

export type OllamaReadinessResult = OllamaReadinessSuccess | OllamaReadinessFailure;

export interface OllamaAnalysisInput {
  base64Image: string;
}

export interface OllamaAnalysisSuccess {
  ok: true;
  text: string;
  host: string;
  model: string;
}

export interface OllamaAnalysisFailure {
  ok: false;
  error: OllamaClientError;
}

export type OllamaAnalysisResult = OllamaAnalysisSuccess | OllamaAnalysisFailure;

interface OllamaClientError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

interface OllamaTagsResponse {
  models?: Array<{ name?: string }>;
}

interface OllamaGenerateResponse {
  response?: string;
  error?: string;
}

interface OllamaHttpResponse<TBody> {
  kind: 'response';
  ok: boolean;
  status: number;
  body: TBody;
}

interface OllamaHttpNetworkError {
  kind: 'network-error';
  error: unknown;
}

type OllamaHttpResult<TBody> = OllamaHttpResponse<TBody> | OllamaHttpNetworkError;

type ModelConfigurationResult =
  | { ok: true; model: string; defaulted: boolean }
  | { ok: false; error: OllamaClientError };

export async function checkOllamaReadiness(
  dependencies: OllamaClientDependencies = {},
): Promise<OllamaReadinessResult> {
  const host = resolveOllamaHost(dependencies.environment);
  const modelConfiguration = resolveVisionModel(dependencies.environment);
  if (!modelConfiguration.ok) {
    return createReadinessFailure(host, '', modelConfiguration.error);
  }

  const fetcher = dependencies.fetch ?? globalThis.fetch;
  const result = await requestJson<OllamaTagsResponse>(fetcher, createOllamaUrl(host, '/api/tags'), {
    method: 'GET',
  });

  if (result.kind === 'network-error') {
    return createReadinessFailure(
      host,
      modelConfiguration.model,
      createOllamaUnavailableError(host, undefined, result.error),
    );
  }

  return handleReadinessResponse(result, host, modelConfiguration);
}

export async function analyzeImageWithOllama(
  input: OllamaAnalysisInput,
  dependencies: OllamaClientDependencies = {},
): Promise<OllamaAnalysisResult> {
  const host = resolveOllamaHost(dependencies.environment);
  const modelConfiguration = resolveVisionModel(dependencies.environment);
  if (!modelConfiguration.ok) {
    return createAnalysisFailure(modelConfiguration.error);
  }

  const fetcher = dependencies.fetch ?? globalThis.fetch;
  const result = await requestJson<OllamaGenerateResponse>(
    fetcher,
    createOllamaUrl(host, '/api/generate'),
    createGenerateRequest(input.base64Image, modelConfiguration.model),
  );

  if (result.kind === 'network-error') {
    return createAnalysisFailure(createOllamaUnavailableError(host, undefined, result.error));
  }

  return handleGenerateResponse(result, host, modelConfiguration.model);
}

function resolveOllamaHost(environment: NodeJS.ProcessEnv = process.env): string {
  const configuredHost = environment.OLLAMA_HOST?.trim();
  return trimTrailingSlash(configuredHost && configuredHost.length > 0 ? configuredHost : DEFAULT_OLLAMA_HOST);
}

function resolveVisionModel(environment: NodeJS.ProcessEnv = process.env): ModelConfigurationResult {
  if (!(OLLAMA_VISION_MODEL_ENVIRONMENT_VARIABLE in environment)) {
    return { ok: true, model: DEFAULT_VISION_MODEL, defaulted: true };
  }

  const configuredModel = environment[OLLAMA_VISION_MODEL_ENVIRONMENT_VARIABLE]?.trim() ?? '';
  if (configuredModel.length === 0) {
    return { ok: false, error: createInvalidModelConfigurationError() };
  }

  return { ok: true, model: configuredModel, defaulted: false };
}

function trimTrailingSlash(host: string): string {
  return host.endsWith('/') ? host.slice(0, -1) : host;
}

function createOllamaUrl(host: string, path: string): string {
  return `${host}${path}`;
}

function hasRequiredModel(tagsResponse: OllamaTagsResponse, requiredModel: string): boolean {
  return tagsResponse.models?.some((model) => model.name === requiredModel) ?? false;
}

function handleReadinessResponse(
  response: OllamaHttpResponse<OllamaTagsResponse>,
  host: string,
  modelConfiguration: { model: string; defaulted: boolean },
): OllamaReadinessResult {
  if (!response.ok) {
    const error = createOllamaUnavailableError(host, response.status);
    return createReadinessFailure(host, modelConfiguration.model, error);
  }

  if (!hasRequiredModel(response.body, modelConfiguration.model)) {
    const error = createModelUnavailableError(modelConfiguration.model);
    return createReadinessFailure(host, modelConfiguration.model, error);
  }

  return createReadinessSuccess(host, modelConfiguration.model);
}

async function requestJson<TBody>(
  fetcher: OllamaClientFetch,
  url: string,
  init: RequestInit,
): Promise<OllamaHttpResult<TBody>> {
  try {
    const response = await fetcher(url, init);
    return {
      kind: 'response',
      ok: response.ok,
      status: response.status,
      body: (await response.json()) as TBody,
    };
  } catch (error) {
    return { kind: 'network-error', error };
  }
}

function createGenerateRequest(base64Image: string, model: string): RequestInit {
  return {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt: ANALYSIS_PROMPT,
      stream: false,
      images: [base64Image],
    }),
  };
}

function handleGenerateResponse(
  response: OllamaHttpResponse<OllamaGenerateResponse>,
  host: string,
  model: string,
): OllamaAnalysisResult {
  if (!response.ok) {
    return createAnalysisFailure(createGenerateResponseError(response.status, response.body.error, model));
  }

  const analysisText = response.body.response?.trim() ?? '';
  if (analysisText.length === 0) {
    return createAnalysisFailure(createEmptyAnalysisResponseError(host, model));
  }

  return { ok: true, text: analysisText, host, model };
}

function createGenerateResponseError(status: number, ollamaError: string | undefined, model: string): OllamaClientError {
  if (status === MODEL_ERROR_STATUS || containsModelName(ollamaError, model)) {
    return createModelUnavailableError(model, ollamaError);
  }

  return createError(ERROR_CODES.OLLAMA_REQUEST_FAILED, 'Ollama image analysis request failed.', {
    status,
    error: ollamaError,
    model,
  });
}

function containsModelName(ollamaError: string | undefined, model: string): boolean {
  return ollamaError?.includes(model) ?? false;
}

function createOllamaUnavailableError(host: string, status?: number, cause?: unknown): OllamaClientError {
  return createError(ERROR_CODES.OLLAMA_UNAVAILABLE, 'Ollama is unavailable.', {
    host,
    status,
    cause: getErrorMessage(cause),
  });
}

function createInvalidModelConfigurationError(): OllamaClientError {
  return createError(
    'INVALID_MODEL_CONFIGURATION' as ErrorCode,
    'OLLAMA_VISION_MODEL must be unset or a non-empty model name.',
    {
      environmentVariable: OLLAMA_VISION_MODEL_ENVIRONMENT_VARIABLE,
      guidance: 'Unset OLLAMA_VISION_MODEL to use the default model, or provide a non-empty model name.',
    },
  );
}

function createModelUnavailableError(model: string, ollamaError?: string): OllamaClientError {
  return createError(ERROR_CODES.MODEL_UNAVAILABLE, 'Required Ollama vision model is unavailable.', {
    model,
    error: ollamaError,
  });
}

function createEmptyAnalysisResponseError(host: string, model: string): OllamaClientError {
  return createError(ERROR_CODES.EMPTY_ANALYSIS_RESPONSE, 'Ollama returned an empty analysis response.', {
    host,
    model,
  });
}

function createReadinessSuccess(host: string, model: string): OllamaReadinessSuccess {
  return { ready: true as const, host, model };
}

function createReadinessFailure(host: string, model: string, error: OllamaClientError): OllamaReadinessFailure {
  return { ready: false, host, model, error };
}

function createAnalysisFailure(error: OllamaClientError): OllamaAnalysisFailure {
  return { ok: false, error };
}

function createError(code: ErrorCode, message: string, details: Record<string, unknown>): OllamaClientError {
  const filteredDetails = Object.fromEntries(
    Object.entries(details).filter((entry): entry is [string, unknown] => entry[1] !== undefined),
  );

  return Object.keys(filteredDetails).length === 0
    ? { code, message }
    : { code, message, details: filteredDetails };
}

function getErrorMessage(error: unknown): string | undefined {
  return error instanceof Error ? error.message : undefined;
}
