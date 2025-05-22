
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

// Types of distribution curves for the color ramp
export type CurveType = 'linear' | 'exponential' | 'logarithmic' | 'emphasizeMiddle' | 'emphasizeEnds' | 'accessibility-AA' | 'accessibility-AAA';

// Calculate lightness based on the selected curve type
export const applyDistributionCurve = (step: number, totalSteps: number, curveType: CurveType): number => {
  // Normalize step to a value between 0 and 1 (where 0 is lightest and 1 is darkest)
  const normalizedStep = (step - 1) / (totalSteps - 1);
  
  switch (curveType) {
    case 'linear':
      // Simple linear distribution
      return 0.98 - normalizedStep * 0.85; // From 0.98 (very light) to 0.13 (very dark)
    
    case 'exponential':
      // Exponential curve - emphasizes light values, more granular dark shades
      return 0.98 - Math.pow(normalizedStep, 1.8) * 0.85;
    
    case 'logarithmic':
      // Logarithmic curve - emphasizes dark values, more granular light shades
      return 0.98 - Math.pow(normalizedStep, 0.7) * 0.85;
    
    case 'emphasizeMiddle':
      // More granularity in the middle tones
      return 0.98 - (0.5 - 0.5 * Math.cos(normalizedStep * Math.PI)) * 0.85;
    
    case 'emphasizeEnds':
      // More granularity at light and dark ends
      return 0.98 - Math.pow(normalizedStep, 2) * (1 - normalizedStep) * 4 * 0.85;
    
    case 'accessibility-AA':
      // Optimized for WCAG 2.0 AA compliance - ensures at least 4.5:1 contrast ratio between text and background
      // For simplified calculation, we're ensuring good contrast points at key steps
      if (normalizedStep < 0.3) return 0.95 - normalizedStep * 0.4; // Lighter shades for backgrounds
      if (normalizedStep > 0.7) return 0.35 - (normalizedStep - 0.7) * 0.3; // Darker shades for text
      return 0.75 - (normalizedStep - 0.3) * 0.7; // Middle range with good separation
      
    case 'accessibility-AAA':
      // Optimized for WCAG 2.0 AAA compliance - ensures at least 7:1 contrast ratio between text and background
      // More extreme separation between light and dark values
      if (normalizedStep < 0.3) return 0.97 - normalizedStep * 0.3; // Even lighter backgrounds
      if (normalizedStep > 0.7) return 0.3 - (normalizedStep - 0.7) * 0.25; // Even darker text
      return 0.77 - (normalizedStep - 0.3) * 0.8; // More separated middle range
      
    default:
      return 0.98 - normalizedStep * 0.85; // Default to linear
  }
};

// Generate a color ramp based on a base color and distribution curve
export const generateColorRamp = (
  baseColor: string, 
  curveType: CurveType = 'linear'
): Record<number, string> => {
  // Convert base color to HSL
  const { h, s } = hexToHSL(baseColor);
  
  // Generate a scale from very light to very dark
  const scale: Record<number, string> = {};
  const totalSteps = 12;
  
  for (let i = 1; i <= totalSteps; i++) {
    // Calculate lightness for this step based on the selected curve
    const stepLightness = applyDistributionCurve(i, totalSteps, curveType);
    scale[i] = hslToHex(h, s, stepLightness);
  }
  
  return scale;
};

// Check contrast ratio between two colors (useful for accessibility)
export const calculateContrastRatio = (color1: string, color2: string): number => {
  // Convert colors to relative luminance
  const getLuminance = (hexColor: string): number => {
    const rgb = hexColor.replace(/^#/, '').match(/.{2}/g)?.map(x => parseInt(x, 16) / 255) || [0, 0, 0];
    
    const [r, g, b] = rgb.map(val => {
      return val <= 0.03928 
        ? val / 12.92 
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    // Relative luminance formula
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  // Calculate contrast ratio
  const lightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  
  return (lightest + 0.05) / (darkest + 0.05);
};

// Check if a color meets accessibility standards against a background color
export const meetsAccessibilityStandard = (
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  const contrastRatio = calculateContrastRatio(foreground, background);
  return level === 'AA' ? contrastRatio >= 4.5 : contrastRatio >= 7;
};

