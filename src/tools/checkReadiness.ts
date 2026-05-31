import { z } from 'zod';

import {
  createJsonToolResponse,
  createStructuredToolErrorResponse,
  type ToolTextResponse,
} from '../errors.js';
import {
  checkOllamaReadiness,
  type OllamaClientDependencies,
} from '../services/ollamaClient.js';

export const CHECK_READINESS_TOOL_NAME = 'check_ollama_readiness';

export const checkReadinessToolInputSchema = {} as const;

export const checkReadinessToolJsonSchema = {
  type: 'object' as const,
  additionalProperties: false as const,
  properties: {},
};

export async function checkOllamaReadinessToolHandler(
  _input: Record<string, never> = {},
  dependencies: OllamaClientDependencies = {},
): Promise<ToolTextResponse> {
  void _input;

  const readiness = await checkOllamaReadiness(dependencies);

  if (readiness.ready) {
    return createJsonToolResponse({
      ready: true,
      host: readiness.host,
      model: readiness.model,
    });
  }

  return createStructuredToolErrorResponse({
    code: readiness.error.code,
    message: readiness.error.message,
    details: {
      ...readiness.error.details,
      ready: false,
      host: readiness.host,
      model: readiness.model,
    },
  });
}

export function validateCheckReadinessInput(input: unknown): Record<string, never> {
  return z.object({}).strict().parse(input);
}

