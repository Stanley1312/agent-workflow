import { readFile, stat } from 'node:fs/promises';
import { extname } from 'node:path';

import { ERROR_CODES, type ErrorCode } from '../errors.js';

const SUPPORTED_IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif']);
const INVALID_IMAGE_PATH_MESSAGE = 'Invalid image path. Provide a local image file path.';
const UNSUPPORTED_IMAGE_TYPE_MESSAGE = 'Unsupported image type. Provide a .png, .jpg, .jpeg, .webp, or .gif file.';

interface FileStatus {
  isFile: () => boolean;
}

interface ImageLoaderFileSystem {
  stat: (filePath: string) => Promise<FileStatus>;
  readFile: (filePath: string) => Promise<Buffer>;
}

interface ValidatedImageInput {
  imagePath: string;
  extension: string;
}

type ImageInputValidationResult =
  | { ok: true; value: ValidatedImageInput }
  | { ok: false; failure: ImageLoadFailure };

type FileStatusResult =
  | { ok: true; status: FileStatus }
  | { ok: false; failure: ImageLoadFailure };

export interface ImageLoaderDependencies {
  fileSystem?: ImageLoaderFileSystem;
}

export interface ImageLoadSuccess {
  ok: true;
  base64: string;
  imagePath: string;
  extension: string;
}

export interface ImageLoadFailure {
  ok: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ImageLoadResult = ImageLoadSuccess | ImageLoadFailure;

export async function loadLocalImageAsBase64(
  imagePath: string,
  dependencies: ImageLoaderDependencies = {},
): Promise<ImageLoadResult> {
  const validationResult = validateImageInput(imagePath);
  if (!validationResult.ok) {
    return validationResult.failure;
  }

  return readSupportedImage(
    validationResult.value.imagePath,
    validationResult.value.extension,
    dependencies.fileSystem ?? defaultFileSystem,
  );
}

function validateImageInput(imagePath: string): ImageInputValidationResult {
  const pathValidationResult = validateImagePath(imagePath);
  if (!pathValidationResult.ok) {
    return pathValidationResult;
  }

  return validateImageExtension(pathValidationResult.value);
}

function validateImagePath(imagePath: string): { ok: true; value: string } | { ok: false; failure: ImageLoadFailure } {
  if (isBlankPath(imagePath) || containsNullByte(imagePath)) {
    return {
      ok: false,
      failure: createFailure(ERROR_CODES.INVALID_IMAGE_PATH, INVALID_IMAGE_PATH_MESSAGE),
    };
  }

  return { ok: true, value: imagePath };
}

function validateImageExtension(imagePath: string): ImageInputValidationResult {
  const extension = getImageExtension(imagePath);
  if (!SUPPORTED_IMAGE_EXTENSIONS.has(extension)) {
    return {
      ok: false,
      failure: createFailure(ERROR_CODES.UNSUPPORTED_IMAGE_TYPE, UNSUPPORTED_IMAGE_TYPE_MESSAGE, { imagePath }),
    };
  }

  return { ok: true, value: { imagePath, extension } };
}

function isBlankPath(imagePath: string): boolean {
  return imagePath.trim().length === 0;
}

function containsNullByte(imagePath: string): boolean {
  return imagePath.includes('\0');
}

function getImageExtension(imagePath: string): string {
  return extname(imagePath).slice(1).toLowerCase();
}

async function readSupportedImage(
  imagePath: string,
  extension: string,
  fileSystem: ImageLoaderFileSystem,
): Promise<ImageLoadResult> {
  const fileStatus = await getFileStatus(imagePath, fileSystem);
  if (!fileStatus.ok) {
    return fileStatus.failure;
  }

  if (!fileStatus.status.isFile()) {
    return createFailure(ERROR_CODES.IMAGE_NOT_FILE, 'Image path must point to a file.', { imagePath });
  }

  return readImageFile(imagePath, extension, fileSystem);
}

async function getFileStatus(
  imagePath: string,
  fileSystem: ImageLoaderFileSystem,
): Promise<FileStatusResult> {
  try {
    return { ok: true, status: await fileSystem.stat(imagePath) };
  } catch (error) {
    return createFileStatusFailure(imagePath, error);
  }
}

function createFileStatusFailure(imagePath: string, error: unknown): FileStatusResult {
  if (isFileSystemErrorCode(error, 'ENOENT')) {
    return {
      ok: false,
      failure: createFailure(ERROR_CODES.IMAGE_NOT_FOUND, 'Image file was not found.', { imagePath }),
    };
  }

  return {
    ok: false,
    failure: createFailure(ERROR_CODES.IMAGE_UNREADABLE, 'Image file cannot be accessed.', { imagePath }),
  };
}

async function readImageFile(
  imagePath: string,
  extension: string,
  fileSystem: ImageLoaderFileSystem,
): Promise<ImageLoadResult> {
  try {
    const imageBytes = await fileSystem.readFile(imagePath);
    return {
      ok: true,
      base64: imageBytes.toString('base64'),
      imagePath,
      extension,
    };
  } catch {
    return createFailure(ERROR_CODES.IMAGE_UNREADABLE, 'Image file cannot be read.', { imagePath });
  }
}

function createFailure(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>,
): ImageLoadFailure {
  return details === undefined
    ? { ok: false, error: { code, message } }
    : { ok: false, error: { code, message, details } };
}

function isFileSystemErrorCode(error: unknown, code: string): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === code;
}

const defaultFileSystem: ImageLoaderFileSystem = {
  stat,
  readFile,
};
