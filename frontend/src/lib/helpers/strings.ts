import * as cryptoServer from 'crypto';

/**
 * Normalizes a string by converting it to lowercase and replacing spaces with hyphens.
 *
 * @param {string} str - The string to normalize.
 * @returns {string} The normalized string.
 *
 * @example
 * const normalizedString = normalizeString('Hello World');
 * console.log(normalizedString);
 *
 * Response:
 * 'hello-world'
 */
export const normalizeString = (str: string) => {
  return str.toLowerCase().replace(/ /g, '-');
};

/**
 * Get a random Hexadecimal color from a string
 * @returns {string} The hexadecimal color.
 *
 * @example
 * const randomHexColor = getRandomHexColor();
 * console.log(randomHexColor);
 *
 * Response:
 * '#123456'
 */
export const getRandomHexColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

/**
 * Generates a random UUID.
 * @returns A random UUID.
 *
 * @example
 * const uuid = getRandomUUID();
 * console.log(uuid);
 *
 * Response:
 * '123e4567-e89b-12d3-a456-426614174000'
 */
export function getRandomUUID() {
  if (typeof window === 'undefined') {
    return cryptoServer.randomBytes(16).toString('hex');
  }
  return crypto.randomUUID();
}
