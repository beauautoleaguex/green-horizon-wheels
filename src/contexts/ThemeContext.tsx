
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our theme
export interface ColorScale {
  [key: number]: string; // 1-12 scale values
}

export interface ThemeColors {
  [key: string]: ColorScale; // Different color names
}

export interface FontSizes {
  [key: string]: string;
}

export interface FontWeights {
  [key: string]: number;
}

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  colors: ThemeColors;
  fonts: string[];
  currentFont: string;
  fontSizes: FontSizes;
  fontWeights: FontWeights;
  mode: ThemeMode;
  toggleMode: () => void;
  updateColor: (colorName: string, step: number, value: string) => void;
  updateColorRamp: (colorName: string, baseColor: string) => void;
  updateFont: (font: string) => void;
  updateFontSize: (name: string, value: string) => void;
  updateFontWeight: (name: string, value: number) => void;
  saveTheme: () => void;
  resetTheme: () => void;
}

// Helper function to convert hex to HSL
const hexToHSL = (hex: string): { h: number, s: number, l: number } => {
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
const hslToHex = (h: number, s: number, l: number): string => {
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
const generateColorRamp = (baseColor: string): ColorScale => {
  // Convert base color to HSL
  const { h, s } = hexToHSL(baseColor);
  
  // Generate a scale from very light to very dark
  const scale: ColorScale = {};
  for (let i = 1; i <= 12; i++) {
    // Calculate lightness for this step (from lightest to darkest)
    const stepLightness = 0.98 - (i - 1) * 0.07; // Values from ~0.98 to ~0.14
    scale[i] = hslToHex(h, s, stepLightness);
  }
  
  return scale;
};

// Initial theme values
const initialColors: ThemeColors = {
  gray: {
    1: "#FFFFFF",
    2: "#F9FAFB",
    3: "#F3F4F6",
    4: "#E5E7EB",
    5: "#D1D5DB",
    6: "#9CA3AF",
    7: "#6B7280",
    8: "#4B5563",
    9: "#374151",
    10: "#1F2937",
    11: "#111827",
    12: "#030712",
  },
  brand: {
    1: "#ECFDF5",
    2: "#D1FAE5",
    3: "#A7F3D0",
    4: "#6EE7B7",
    5: "#34D399",
    6: "#10B981",
    7: "#059669",
    8: "#047857",
    9: "#008077", // Current brand color
    10: "#065F46",
    11: "#064E3B",
    12: "#022C22",
  },
  red: {
    1: "#FEF2F2",
    2: "#FEE2E2",
    3: "#FECACA",
    4: "#FCA5A5",
    5: "#F87171",
    6: "#EF4444",
    7: "#DC2626",
    8: "#B91C1C",
    9: "#991B1B",
    10: "#7F1D1D",
    11: "#671818",
    12: "#450A0A",
  },
  blue: {
    1: "#EFF6FF",
    2: "#DBEAFE",
    3: "#BFDBFE",
    4: "#93C5FD",
    5: "#60A5FA",
    6: "#3B82F6",
    7: "#2563EB",
    8: "#1D4ED8",
    9: "#1E40AF",
    10: "#1E3A8A",
    11: "#172554",
    12: "#0C1331",
  },
  amber: {
    1: "#FFFBEB",
    2: "#FEF3C7",
    3: "#FDE68A",
    4: "#FCD34D",
    5: "#FBBF24",
    6: "#F59E0B",
    7: "#D97706",
    8: "#B45309",
    9: "#92400E",
    10: "#78350F",
    11: "#5E2F12",
    12: "#451A03",
  }
};

const initialFonts = [
  "Lexend, sans-serif",
  "Inter, sans-serif", 
  "Roboto, sans-serif", 
  "Open Sans, sans-serif",
  "Poppins, sans-serif",
  "Montserrat, sans-serif",
  "Raleway, sans-serif",
  "Playfair Display, serif",
];

const initialFontSizes: FontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
};

const initialFontWeights: FontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or use initial values
  const [colors, setColors] = useState<ThemeColors>(() => {
    const savedColors = localStorage.getItem('themeColors');
    return savedColors ? JSON.parse(savedColors) : initialColors;
  });
  
  const [fonts, setFonts] = useState<string[]>(initialFonts);
  
  const [currentFont, setCurrentFont] = useState<string>(() => {
    const savedFont = localStorage.getItem('themeFont');
    return savedFont || initialFonts[0];
  });
  
  const [fontSizes, setFontSizes] = useState<FontSizes>(() => {
    const savedFontSizes = localStorage.getItem('themeFontSizes');
    return savedFontSizes ? JSON.parse(savedFontSizes) : initialFontSizes;
  });
  
  const [fontWeights, setFontWeights] = useState<FontWeights>(() => {
    const savedFontWeights = localStorage.getItem('themeFontWeights');
    return savedFontWeights ? JSON.parse(savedFontWeights) : initialFontWeights;
  });
  
  // Add theme mode state
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'light';
  });

  // Toggle theme mode
  const toggleMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // Apply theme to document when it changes
  useEffect(() => {
    // Create CSS variables for colors
    Object.entries(colors).forEach(([colorName, scale]) => {
      Object.entries(scale).forEach(([step, value]) => {
        document.documentElement.style.setProperty(
          `--color-${colorName}-${step}`, 
          value
        );
      });
    });
    
    // Apply font family
    document.documentElement.style.setProperty('--font-family', currentFont);
    
    // Apply font sizes
    Object.entries(fontSizes).forEach(([name, size]) => {
      document.documentElement.style.setProperty(`--font-size-${name}`, size);
    });
    
    // Apply font weights
    Object.entries(fontWeights).forEach(([name, weight]) => {
      document.documentElement.style.setProperty(`--font-weight-${name}`, weight.toString());
    });
  }, [colors, currentFont, fontSizes, fontWeights]);
  
  // Apply dark/light mode changes
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme mode preference to localStorage
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Update functions
  const updateColor = (colorName: string, step: number, value: string) => {
    setColors(prev => ({
      ...prev,
      [colorName]: {
        ...prev[colorName],
        [step]: value
      }
    }));
  };
  
  const updateColorRamp = (colorName: string, baseColor: string) => {
    const newRamp = generateColorRamp(baseColor);
    setColors(prev => ({
      ...prev,
      [colorName]: newRamp
    }));
  };

  const updateFont = (font: string) => {
    setCurrentFont(font);
  };

  const updateFontSize = (name: string, value: string) => {
    setFontSizes(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateFontWeight = (name: string, value: number) => {
    setFontWeights(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save theme to localStorage
  const saveTheme = () => {
    localStorage.setItem('themeColors', JSON.stringify(colors));
    localStorage.setItem('themeFont', currentFont);
    localStorage.setItem('themeFontSizes', JSON.stringify(fontSizes));
    localStorage.setItem('themeFontWeights', JSON.stringify(fontWeights));
    localStorage.setItem('themeMode', mode);
  };

  // Reset theme to initial values
  const resetTheme = () => {
    setColors(initialColors);
    setCurrentFont(initialFonts[0]);
    setFontSizes(initialFontSizes);
    setFontWeights(initialFontWeights);
  };

  return (
    <ThemeContext.Provider value={{
      colors,
      fonts,
      currentFont,
      fontSizes,
      fontWeights,
      mode,
      toggleMode,
      updateColor,
      updateColorRamp,
      updateFont,
      updateFontSize,
      updateFontWeight,
      saveTheme,
      resetTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
