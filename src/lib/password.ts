import crypto from 'node:crypto';

const HASH_ALGORITHM = 'sha256';
const HASH_SALT_LENGTH = 16;
const HASH_ITERATIONS = 100_000;
const HASH_KEY_LENGTH = 32;
const HASH_DIGEST = 'hex';
const HASH_DELIMITER = ':';

function derivePasswordHash(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM)
    .toString(HASH_DIGEST);
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(HASH_SALT_LENGTH).toString(HASH_DIGEST);
  const hash = derivePasswordHash(password, salt);

  return [salt, hash].join(HASH_DELIMITER);
}

export function verifyPassword(password: string, storedPasswordHash: string): boolean {
  const [salt, expectedHash] = storedPasswordHash.split(HASH_DELIMITER);

  if (!salt || !expectedHash) {
    return false;
  }

  const actualHash = derivePasswordHash(password, salt);
  return crypto.timingSafeEqual(Buffer.from(actualHash, HASH_DIGEST), Buffer.from(expectedHash, HASH_DIGEST));
}
