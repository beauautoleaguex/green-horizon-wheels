
// Helper functions for color manipulation

// Convert hex to HSL
export const hexToHSL = (hex: string): { h: number, s: number, l: number } => {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Find the min and max values to compute the lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // Calculate HSL values
  let h = 0, s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h *= 60;
  }
  
  return { h, s, l };
};

// Helper function to convert HSL to hex
export const hslToHex = (h: number, s: number, l: number): string => {
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, (h / 360) + 1/3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, (h / 360) - 1/3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Generate a color ramp based on a base color
export const generateColorRamp = (baseColor: string): Record<number, string> => {
  // Convert base color to HSL
  const { h, s } = hexToHSL(baseColor);
  
  // Generate a scale from very light to very dark
  const scale: Record<number, string> = {};
  for (let i = 1; i <= 12; i++) {
    // Calculate lightness for this step (from lightest to darkest)
    const stepLightness = 0.98 - (i - 1) * 0.07; // Values from ~0.98 to ~0.14
    scale[i] = hslToHex(h, s, stepLightness);
  }
  
  return scale;
};
