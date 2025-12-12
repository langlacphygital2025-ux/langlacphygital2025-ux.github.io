/**
 * Text Chunker Utility
 * Handles splitting messages into word chunks and calculating timing for synchronized display
 */

/**
 * Splits text into chunks of specified word count
 * @param {string} text - The text to split
 * @param {number} wordsPerChunk - Number of words per chunk (default: 5)
 * @returns {string[]} Array of text chunks
 */
export function splitIntoChunks(text, wordsPerChunk = 5) {
  if (!text || typeof text !== "string") {
    return [];
  }

  // Trim and normalize whitespace
  const normalizedText = text.trim().replace(/\s+/g, " ");

  if (!normalizedText) {
    return [];
  }

  // Split by whitespace to get words
  const words = normalizedText.split(" ");

  // Handle short messages (less than or equal to wordsPerChunk)
  if (words.length <= wordsPerChunk) {
    return [normalizedText];
  }

  // Create chunks
  const chunks = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunk = words.slice(i, i + wordsPerChunk).join(" ");
    chunks.push(chunk);
  }

  return chunks;
}

/**
 * Calculates timing intervals for each chunk based on total audio duration
 * Uses equal time distribution strategy
 * @param {number} totalDuration - Total audio duration in milliseconds
 * @param {number} numChunks - Number of chunks to display
 * @returns {number[]} Array of timestamps (in ms) when each chunk should appear
 */
export function calculateChunkTimings(totalDuration, numChunks) {
  if (!totalDuration || totalDuration <= 0 || !numChunks || numChunks <= 0) {
    return [0];
  }

  // Single chunk - display immediately
  if (numChunks === 1) {
    return [0];
  }

  // Calculate equal time per chunk
  const timePerChunk = totalDuration / numChunks;

  // Generate timing array
  const timings = [];
  for (let i = 0; i < numChunks; i++) {
    timings.push(Math.round(i * timePerChunk));
  }

  return timings;
}

/**
 * Validates chunk timing configuration
 * @param {number[]} timings - Array of timing values
 * @param {number} totalDuration - Total duration
 * @returns {boolean} True if timings are valid
 */
export function validateTimings(timings, totalDuration) {
  if (!Array.isArray(timings) || timings.length === 0) {
    return false;
  }

  // First timing should be 0 or very close to 0
  if (timings[0] !== 0) {
    return false;
  }

  // Timings should be in ascending order
  for (let i = 1; i < timings.length; i++) {
    if (timings[i] <= timings[i - 1]) {
      return false;
    }
  }

  // Last timing should not exceed total duration
  if (timings[timings.length - 1] >= totalDuration) {
    return false;
  }

  return true;
}
