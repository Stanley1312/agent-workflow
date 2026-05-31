import { z } from 'zod';

import {
  ERROR_CODES,
  createPlainTextToolResponse,
  createStructuredToolErrorResponse,
  type ToolTextResponse,
} from '../errors.js';
import { loadLocalImageAsBase64, type ImageLoaderDependencies } from '../services/imageLoader.js';
import { analyzeImageWithOllama, type OllamaClientDependencies } from '../services/ollamaClient.js';

const REQUIRED_MODEL_NAME = 'llama3.2-vision';

export const ANALYZE_IMAGE_TOOL_NAME = 'analyze_image';

export const analyzeImageToolInputSchema = {
  imagePath: z.string().min(1),
} as const;

export const analyzeImageToolJsonSchema = {
  type: 'object' as const,
  additionalProperties: false as const,
  required: ['imagePath'],
  properties: {
    imagePath: {
      type: 'string' as const,
      description: 'Local filesystem path to one readable image file.',
      minLength: 1,
    },
  },
};

export interface AnalyzeImageToolInput {
  imagePath: string;
}

export type AnalyzeImageToolDependencies = ImageLoaderDependencies & OllamaClientDependencies;

export async function analyzeImageToolHandler(
  input: AnalyzeImageToolInput,
  dependencies: AnalyzeImageToolDependencies = {},
): Promise<ToolTextResponse> {
  const parsedInput = parseAnalyzeImageToolInput(input);
  if (!parsedInput.ok) {
    return createStructuredToolErrorResponse(parsedInput.error);
  }

  const image = await loadLocalImageAsBase64(parsedInput.value.imagePath, dependencies);
  if (!image.ok) {
    return createStructuredToolErrorResponse(image.error);
  }

  const analysis = await analyzeImageWithOllama({ base64Image: image.base64 }, dependencies);
  if (!analysis.ok) {
    return createStructuredToolErrorResponse(analysis.error);
  }

  return createPlainTextToolResponse(analysis.text);
}

type AnalyzeImageInputParseResult =
  | { ok: true; value: AnalyzeImageToolInput }
  | {
      ok: false;
      error: {
        code: typeof ERROR_CODES.INVALID_IMAGE_PATH;
        message: string;
      };
    };

function parseAnalyzeImageToolInput(input: AnalyzeImageToolInput): AnalyzeImageInputParseResult {
  const result = z.object(analyzeImageToolInputSchema).strict().safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      error: {
        code: ERROR_CODES.INVALID_IMAGE_PATH,
        message: 'Invalid image path. Provide a local image file path.',
      },
    };
  }

  return { ok: true, value: result.data };
}

export { REQUIRED_MODEL_NAME };
