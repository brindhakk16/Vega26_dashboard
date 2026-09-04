/**
 * AMG8833 Thermal Color Mapping & Palette Utilities
 */

export const PALETTES = {
  IRONBOW: 'ironbow',
  RAINBOW: 'rainbow',
  INFERNO: 'inferno',
  GRAYSCALE: 'grayscale',
  FLIR: 'flir'
};

// Color stop definitions (normalized [0..1] -> [r, g, b])
const PALETTE_STOPS = {
  [PALETTES.IRONBOW]: [
    { p: 0.00, r: 16,  g: 10,  b: 40  }, // Deep Violet
    { p: 0.20, r: 30,  g: 40,  b: 160 }, // Blue
    { p: 0.40, r: 0,   g: 180, b: 200 }, // Cyan
    { p: 0.55, r: 40,  g: 200, b: 60  }, // Green
    { p: 0.70, r: 240, g: 220, b: 20  }, // Yellow
    { p: 0.85, r: 240, g: 100, b: 20  }, // Orange
    { p: 0.95, r: 220, g: 20,  b: 40  }, // Red
    { p: 1.00, r: 255, g: 255, b: 255 }  // White
  ],

  [PALETTES.RAINBOW]: [
    { p: 0.00, r: 0,   g: 0,   b: 255 }, // Blue
    { p: 0.25, r: 0,   g: 255, b: 255 }, // Cyan
    { p: 0.50, r: 0,   g: 255, b: 0   }, // Green
    { p: 0.75, r: 255, g: 255, b: 0   }, // Yellow
    { p: 0.90, r: 255, g: 128, b: 0   }, // Orange
    { p: 1.00, r: 255, g: 0,   b: 0   }  // Red
  ],

  [PALETTES.INFERNO]: [
    { p: 0.00, r: 0,   g: 0,   b: 4   }, // Black
    { p: 0.25, r: 87,  g: 16,  b: 110 }, // Dark Purple
    { p: 0.50, r: 187, g: 55,  b: 84  }, // Magenta
    { p: 0.75, r: 249, g: 142, b: 9   }, // Bright Orange
    { p: 0.90, r: 252, g: 219, b: 63  }, // Yellow
    { p: 1.00, r: 252, g: 255, b: 164 }  // Light Yellow / White
  ],

  [PALETTES.GRAYSCALE]: [
    { p: 0.00, r: 0,   g: 0,   b: 0   },
    { p: 1.00, r: 255, g: 255, b: 255 }
  ],

  [PALETTES.FLIR]: [
    { p: 0.00, r: 0,   g: 0,   b: 64  },
    { p: 0.25, r: 0,   g: 128, b: 192 },
    { p: 0.50, r: 128, g: 220, b: 128 },
    { p: 0.75, r: 255, g: 200, b: 0   },
    { p: 0.90, r: 230, g: 40,  b: 40  },
    { p: 1.00, r: 255, g: 255, b: 240 }
  ]
};

/**
 * Maps a normalized value [0..1] to an RGB color array [r, g, b]
 */
export function getRGBForNormalizedValue(val, paletteName = PALETTES.IRONBOW) {
  const clampVal = Math.max(0, Math.min(1, val));
  const stops = PALETTE_STOPS[paletteName] || PALETTE_STOPS[PALETTES.IRONBOW];

  if (clampVal <= 0) return [stops[0].r, stops[0].g, stops[0].b];
  if (clampVal >= 1) {
    const last = stops[stops.length - 1];
    return [last.r, last.g, last.b];
  }

  // Find bounding stops
  let i = 0;
  while (i < stops.length - 1 && stops[i + 1].p < clampVal) {
    i++;
  }

  const s1 = stops[i];
  const s2 = stops[i + 1];

  const t = (clampVal - s1.p) / (s2.p - s1.p);

  const r = Math.round(s1.r + t * (s2.r - s1.r));
  const g = Math.round(s1.g + t * (s2.g - s1.g));
  const b = Math.round(s1.b + t * (s2.b - s1.b));

  return [r, g, b];
}

/**
 * Converts temp to CSS rgb(...) string
 */
export function getTemperatureColor(temp, minTemp, maxTemp, paletteName = PALETTES.IRONBOW) {
  const range = maxTemp - minTemp;
  const normalized = range > 0 ? (temp - minTemp) / range : 0.5;
  const [r, g, b] = getRGBForNormalizedValue(normalized, paletteName);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Temperature Unit Converters
 */
export function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

export function formatTemp(tempC, unit = 'C', decimals = 1) {
  if (typeof tempC !== 'number' || isNaN(tempC)) return '--';
  const val = unit === 'F' ? celsiusToFahrenheit(tempC) : tempC;
  return `${val.toFixed(decimals)}°${unit}`;
}
