/**
 * Normalizes a string by converting it to lowercase and replacing spaces with hyphens.
 *
 * @param {string} str - The string to normalize.
 * @returns {string} The normalized string.
 */
export const normalizeString = (str: string) => {
  return str.toLowerCase().replace(/ /g, '-');
};

/**
 * Get a random Hexadecimal color from a string
 * @returns {string} The hexadecimal color.
 */
export const getRandomHexColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};
