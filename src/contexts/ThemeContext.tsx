
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

interface ThemeContextType {
  colors: ThemeColors;
  fonts: string[];
  currentFont: string;
  fontSizes: FontSizes;
  fontWeights: FontWeights;
  updateColor: (colorName: string, step: number, value: string) => void;
  updateFont: (font: string) => void;
  updateFontSize: (name: string, value: string) => void;
  updateFontWeight: (name: string, value: number) => void;
  saveTheme: () => void;
  resetTheme: () => void;
}

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
      updateColor,
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
