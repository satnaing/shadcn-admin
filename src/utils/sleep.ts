/**
 * A simple promise that resolves after a given delay.
 * @param {number} ms The delay in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
export const sleep = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
