/**
 * AMG8833 Matrix Upscaling & 2D Bilinear Interpolation Algorithm
 * Upscales an 8x8 sensor array to 64x64 smooth pixel grid.
 */

/**
 * Perform 2D Bilinear Interpolation from 8x8 source to targetSize x targetSize grid (default 64x64)
 */
export function interpolateBilinear(src8x8, targetSize = 64) {
  const result = Array.from({ length: targetSize }, () => new Float32Array(targetSize));

  const srcWidth = 8;
  const srcHeight = 8;

  // Scale ratios
  const scaleX = (srcWidth - 1) / (targetSize - 1);
  const scaleY = (srcHeight - 1) / (targetSize - 1);

  for (let r = 0; r < targetSize; r++) {
    const srcY = r * scaleY;
    const y1 = Math.floor(srcY);
    const y2 = Math.min(y1 + 1, srcHeight - 1);
    const dy = srcY - y1;

    for (let c = 0; c < targetSize; c++) {
      const srcX = c * scaleX;
      const x1 = Math.floor(srcX);
      const x2 = Math.min(x1 + 1, srcWidth - 1);
      const dx = srcX - x1;

      // Sample 4 neighboring 8x8 grid pixels
      const q11 = src8x8[y1][x1];
      const q21 = src8x8[y1][x2];
      const q12 = src8x8[y2][x1];
      const q22 = src8x8[y2][x2];

      // Interpolate along X
      const r1 = (1 - dx) * q11 + dx * q21;
      const r2 = (1 - dx) * q12 + dx * q22;

      // Interpolate along Y
      const interpolatedVal = (1 - dy) * r1 + dy * r2;

      result[r][c] = interpolatedVal;
    }
  }

  return result;
}

/**
 * Calculates contour line mask threshold positions for given temperature matrix
 */
export function generateContourLines(matrix, stepDegrees = 2.0) {
  const height = matrix.length;
  const width = matrix[0].length;
  const contourMask = Array.from({ length: height }, () => new Uint8Array(width));

  for (let r = 0; r < height - 1; r++) {
    for (let c = 0; c < width - 1; c++) {
      const val = matrix[r][c];
      const right = matrix[r][c + 1];
      const down = matrix[r + 1][c];

      const level = Math.floor(val / stepDegrees);
      const levelRight = Math.floor(right / stepDegrees);
      const levelDown = Math.floor(down / stepDegrees);

      if (level !== levelRight || level !== levelDown) {
        contourMask[r][c] = 1;
      }
    }
  }

  return contourMask;
}
