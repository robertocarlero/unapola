/**
 * Normalizes a string by converting it to lowercase and replacing spaces with hyphens.
 *
 * @param {string} str - The string to normalize.
 * @returns {string} The normalized string.
 */
export const normalizeString = (str: string) => {
  return str.toLowerCase().replace(/ /g, '-');
};
