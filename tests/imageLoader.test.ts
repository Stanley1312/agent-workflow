import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const TEMPORARY_IMAGE_DIRECTORY = '/home/dudu/Workspace/projects/agent-workflow/tests/.tmp-image-loader';

type ImageLoadSuccess = {
  ok: true;
  base64: string;
  imagePath: string;
  extension: string;
};

type ImageLoadFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

type ImageLoadResult = ImageLoadSuccess | ImageLoadFailure;

type ImageLoaderDependencies = {
  fileSystem?: {
    stat: (filePath: string) => Promise<{ isFile: () => boolean }>;
    readFile: (filePath: string) => Promise<Buffer>;
  };
};

type LoadLocalImageAsBase64 = (
  imagePath: string,
  dependencies?: ImageLoaderDependencies,
) => Promise<ImageLoadResult>;

async function loadImage(
  imagePath: string,
  dependencies?: ImageLoaderDependencies,
): Promise<ImageLoadResult> {
  const module = (await import('../src/services/imageLoader.js')) as {
    loadLocalImageAsBase64: LoadLocalImageAsBase64;
  };

  return module.loadLocalImageAsBase64(imagePath, dependencies);
}

function expectImageLoadFailure(result: ImageLoadResult, code: string): void {
  expect(result).toMatchObject({
    ok: false,
    error: {
      code,
      message: expect.any(String),
    },
  });
}

function createFailingFileSystem(): Required<ImageLoaderDependencies>['fileSystem'] {
  return {
    stat: vi.fn(async () => {
      throw new Error('filesystem access should be skipped');
    }),
    readFile: vi.fn(async () => {
      throw new Error('filesystem access should be skipped');
    }),
  };
}

describe('Image loader', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    await rm(TEMPORARY_IMAGE_DIRECTORY, { recursive: true, force: true });
    await mkdir(TEMPORARY_IMAGE_DIRECTORY, { recursive: true });
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(TEMPORARY_IMAGE_DIRECTORY, { recursive: true, force: true });
  });

  it.each([
    ['empty', ''],
    ['whitespace-only', '   \t\n  '],
  ])('should reject %s image paths before image analysis when the image path is missing', async (_caseName, imagePath) => {
    const fileSystem = createFailingFileSystem();

    const result = await loadImage(imagePath, { fileSystem });

    expectImageLoadFailure(result, 'INVALID_IMAGE_PATH');
    expect(fileSystem.stat).not.toHaveBeenCalled();
    expect(fileSystem.readFile).not.toHaveBeenCalled();
  });

  it('should reject malformed image paths before touching the filesystem when the image path contains a null byte', async () => {
    const fileSystem = createFailingFileSystem();

    const result = await loadImage(`${TEMPORARY_IMAGE_DIRECTORY}/unsafe\0.png`, { fileSystem });

    expectImageLoadFailure(result, 'INVALID_IMAGE_PATH');
    expect(fileSystem.stat).not.toHaveBeenCalled();
    expect(fileSystem.readFile).not.toHaveBeenCalled();
  });

  it('should report a missing image before image analysis when the local image file does not exist', async () => {
    const missingPath = join(TEMPORARY_IMAGE_DIRECTORY, 'missing.png');

    const result = await loadImage(missingPath);

    expectImageLoadFailure(result, 'IMAGE_NOT_FOUND');
    expect(result).toMatchObject({
      ok: false,
      error: {
        details: {
          imagePath: missingPath,
        },
      },
    });
  });

  it('should reject directory image paths before image analysis when the local path is not a file', async () => {
    const directoryPath = join(TEMPORARY_IMAGE_DIRECTORY, 'image-directory.png');
    await mkdir(directoryPath);

    const result = await loadImage(directoryPath);

    expectImageLoadFailure(result, 'IMAGE_NOT_FILE');
  });

  it('should report an unreadable image before image analysis when the local image file cannot be read', async () => {
    const unreadablePath = join(TEMPORARY_IMAGE_DIRECTORY, 'unreadable.png');
    const fileSystem = {
      stat: vi.fn(async () => ({ isFile: () => true })),
      readFile: vi.fn(async () => {
        const error = new Error('permission denied') as NodeJS.ErrnoException;
        error.code = 'EACCES';
        throw error;
      }),
    };

    const result = await loadImage(unreadablePath, { fileSystem });

    expectImageLoadFailure(result, 'IMAGE_UNREADABLE');
    expect(fileSystem.stat).toHaveBeenCalledWith(unreadablePath);
    expect(fileSystem.readFile).toHaveBeenCalledWith(unreadablePath);
  });

  it('should reject unsupported image types before image analysis when the local file extension is not supported', async () => {
    const unsupportedPath = join(TEMPORARY_IMAGE_DIRECTORY, 'notes.txt');
    await writeFile(unsupportedPath, 'not an image');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = await loadImage(unsupportedPath);

    expectImageLoadFailure(result, 'UNSUPPORTED_IMAGE_TYPE');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it.each(['.png', '.jpg', '.jpeg', '.webp', '.gif'])(
    'should read supported %s images as base64 when the local image file is valid',
    async (extension) => {
      const imagePath = join(TEMPORARY_IMAGE_DIRECTORY, `valid-image${extension}`);
      const imageBytes = Buffer.from(`valid image bytes for ${extension}`);
      await writeFile(imagePath, imageBytes);

      const result = await loadImage(imagePath);

      expect(result).toEqual({
        ok: true,
        base64: imageBytes.toString('base64'),
        imagePath,
        extension: extension.slice(1),
      });
    },
  );

  it('should skip filesystem access for malformed paths when local image validation fails at the path boundary', async () => {
    const fileSystem = createFailingFileSystem();

    const result = await loadImage('\0', { fileSystem });

    expectImageLoadFailure(result, 'INVALID_IMAGE_PATH');
    expect(fileSystem.stat).not.toHaveBeenCalled();
    expect(fileSystem.readFile).not.toHaveBeenCalled();
  });

  it('should not involve Ollama when local image validation rejects an unsafe or unsupported image path', async () => {
    const unsupportedPath = join(TEMPORARY_IMAGE_DIRECTORY, 'unsupported.svg');
    await writeFile(unsupportedPath, '<svg />');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = await loadImage(unsupportedPath);

    expectImageLoadFailure(result, 'UNSUPPORTED_IMAGE_TYPE');
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
