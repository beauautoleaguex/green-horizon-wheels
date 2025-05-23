
import { supabase } from '@/lib/supabase';
import { 
  ThemeColors, 
  FontSizes, 
  FontWeights, 
  ThemeMode, 
  TypographyScale,
  Brand
} from '@/types/theme';
import { 
  initialColors, 
  initialFonts, 
  initialFontSizes, 
  initialFontWeights, 
  initialTypographyScale,
  initialBrands,
} from '@/constants/themeDefaults';

// Helper to check if user is authenticated
const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Save theme data to Supabase
export const saveThemeToSupabase = async (
  userId: string | undefined,
  colors: ThemeColors,
  currentFont: string,
  fontSizes: FontSizes,
  fontWeights: FontWeights,
  typographyScale: TypographyScale,
  brands: Brand[],
  currentBrand: Brand
): Promise<void> => {
  if (!userId) {
    console.warn('No user ID provided for theme storage');
    return;
  }

  try {
    const { error } = await supabase
      .from('user_themes')
      .upsert({
        user_id: userId,
        colors,
        current_font: currentFont,
        font_sizes: fontSizes,
        font_weights: fontWeights,
        typography_scale: typographyScale,
        brands,
        current_brand: currentBrand,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error saving theme to Supabase:', error);
      // Fall back to localStorage if Supabase fails
      saveThemeToLocalStorage(
        colors,
        currentFont,
        fontSizes,
        fontWeights,
        typographyScale,
        brands,
        currentBrand
      );
    }
  } catch (err) {
    console.error('Failed to save theme to Supabase:', err);
    // Fall back to localStorage
    saveThemeToLocalStorage(
      colors,
      currentFont,
      fontSizes,
      fontWeights,
      typographyScale,
      brands,
      currentBrand
    );
  }
};

// Fetch theme data from Supabase
export const fetchThemeFromSupabase = async (userId: string | undefined): Promise<{
  colors: ThemeColors,
  currentFont: string,
  fontSizes: FontSizes,
  fontWeights: FontWeights,
  typographyScale: TypographyScale,
  brands: Brand[],
  currentBrand: Brand
} | null> => {
  if (!userId) {
    console.warn('No user ID provided for theme retrieval');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_themes')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      console.warn('No theme data found in Supabase, using local storage or defaults');
      return getThemeFromLocalStorage();
    }

    return {
      colors: data.colors,
      currentFont: data.current_font,
      fontSizes: data.font_sizes,
      fontWeights: data.font_weights,
      typographyScale: data.typography_scale,
      brands: data.brands,
      currentBrand: data.current_brand
    };
  } catch (err) {
    console.error('Failed to fetch theme from Supabase:', err);
    return getThemeFromLocalStorage();
  }
};

// Fallback: Save theme to localStorage
export const saveThemeToLocalStorage = (
  colors: ThemeColors,
  currentFont: string,
  fontSizes: FontSizes,
  fontWeights: FontWeights,
  typographyScale: TypographyScale,
  brands: Brand[],
  currentBrand: Brand
): void => {
  localStorage.setItem('themeStorageColors', JSON.stringify(colors));
  localStorage.setItem('themeStorageFont', currentFont);
  localStorage.setItem('themeStorageFontSizes', JSON.stringify(fontSizes));
  localStorage.setItem('themeStorageFontWeights', JSON.stringify(fontWeights));
  localStorage.setItem('themeStorageTypographyScale', typographyScale);
  localStorage.setItem('themeStorageBrands', JSON.stringify(brands));
  localStorage.setItem('themeStorageCurrentBrand', JSON.stringify(currentBrand));
};

// Fallback: Get theme from localStorage or use defaults
export const getThemeFromLocalStorage = (): {
  colors: ThemeColors,
  currentFont: string,
  fontSizes: FontSizes,
  fontWeights: FontWeights,
  typographyScale: TypographyScale,
  brands: Brand[],
  currentBrand: Brand
} => {
  // Get colors from localStorage or use defaults
  const savedColors = localStorage.getItem('themeStorageColors');
  const colors = savedColors ? JSON.parse(savedColors) : initialColors;

  // Get font from localStorage or use defaults
  const savedFont = localStorage.getItem('themeStorageFont');
  const currentFont = savedFont || initialFonts[0];

  // Get font sizes from localStorage or use defaults
  const savedFontSizes = localStorage.getItem('themeStorageFontSizes');
  const fontSizes = savedFontSizes ? JSON.parse(savedFontSizes) : initialFontSizes;

  // Get font weights from localStorage or use defaults
  const savedFontWeights = localStorage.getItem('themeStorageFontWeights');
  const fontWeights = savedFontWeights ? JSON.parse(savedFontWeights) : initialFontWeights;

  // Get typography scale from localStorage or use defaults
  const savedScale = localStorage.getItem('themeStorageTypographyScale');
  const typographyScale = (savedScale as TypographyScale) || initialTypographyScale;

  // Get brands from localStorage or use defaults with logo handling
  const savedBrands = localStorage.getItem('themeStorageBrands');
  const brands = savedBrands ? JSON.parse(savedBrands) : initialBrands.map(brand => {
    if (brand.name === 'MyMoto' && !brand.logo) {
      return {
        ...brand,
        logo: '/lovable-uploads/d99fbaef-645b-46ba-975c-5b747c2667b9.png'
      };
    }
    return brand;
  });

  // Get current brand from localStorage or use defaults with logo handling
  const savedCurrentBrand = localStorage.getItem('themeStorageCurrentBrand');
  const currentBrand = savedCurrentBrand 
    ? JSON.parse(savedCurrentBrand) 
    : brands[0];

  return {
    colors,
    currentFont,
    fontSizes,
    fontWeights,
    typographyScale,
    brands,
    currentBrand
  };
};

// Get current user ID
export const getCurrentUserId = async (): Promise<string | undefined> => {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id;
  } catch (err) {
    console.error('Failed to get current user:', err);
    return undefined;
  }
};
