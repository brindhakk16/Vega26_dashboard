/**
 * AMG8833 Thermal Spatial Coordinate Mapping & Projection Engine
 * Translates 8x8 sensor matrix coordinates (0..7) into normalized FOV bounds
 * and maps them onto reference visual layer pixel coordinates.
 */

export function sensorToNormalizedCoordinate(sensorX, sensorY) {
  const normX = Math.max(0, Math.min(1, sensorX / 7));
  const normY = Math.max(0, Math.min(1, sensorY / 7));
  return { x: normX, y: normY };
}

export function applyRotationAndFlip(normX, normY, rotation = 0, flipH = false, flipV = false) {
  let x = normX;
  let y = normY;

  // Flip horizontal/vertical
  if (flipH) x = 1 - x;
  if (flipV) y = 1 - y;

  // Sensor rotation
  switch (rotation) {
    case 90:
      return { x: 1 - y, y: x };
    case 180:
      return { x: 1 - x, y: 1 - y };
    case 270:
      return { x: y, y: 1 - x };
    case 0:
    default:
      return { x, y };
  }
}

/**
 * Projects an 8x8 sensor pixel (sensorX, sensorY) to container pixel coordinates
 */
export function projectSensorPixel(sensorX, sensorY, calibration, containerWidth, containerHeight) {
  const norm = sensorToNormalizedCoordinate(sensorX, sensorY);
  const mapped = applyRotationAndFlip(
    norm.x,
    norm.y,
    calibration.sensorRotation || 0,
    calibration.flipHorizontal || false,
    calibration.flipVertical || false
  );

  const fovX = containerWidth * (calibration.imageX || 0.15);
  const fovY = containerHeight * (calibration.imageY || 0.12);
  const fovW = containerWidth * (calibration.imageWidth || 0.70);
  const fovH = containerHeight * (calibration.imageHeight || 0.76);

  const pixelX = fovX + mapped.x * fovW;
  const pixelY = fovY + mapped.y * fovH;

  return { x: pixelX, y: pixelY, fovX, fovY, fovW, fovH };
}

/**
 * Calculates absolute FOV bounding box rectangle in container pixel coordinates
 */
export function getFovBoundingBox(calibration, containerWidth, containerHeight) {
  return {
    x: containerWidth * (calibration.imageX || 0.15),
    y: containerHeight * (calibration.imageY || 0.12),
    width: containerWidth * (calibration.imageWidth || 0.70),
    height: containerHeight * (calibration.imageHeight || 0.76)
  };
}
