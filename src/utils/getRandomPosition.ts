/**
 * Ensures the box stays fully within the video frame without going off-screen.
 *
 * @param {number} videoWidth - Width of the video element in pixels
 * @param {number} videoHeight - Height of the video element in pixels
 * @param {number} boxSize - Size of the square box (width and height are equal)
 * @returns {Object} Object with x and y coordinates for the top-left corner of the box
 */
export function getRandomPosition(videoWidth: number, videoHeight: number, boxSize: number) {
  const maxX = Math.max(0, videoWidth - boxSize);
  const maxY = Math.max(0, videoHeight - boxSize);

  // Generate random coordinates within valid bounds
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  return { x, y };
}
