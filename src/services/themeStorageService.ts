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

// Check if user is an admin
export const checkIfUserIsAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('is_admin')
      .eq('user_id', userId)
      .single();
      
    if (error || !data) {
      console.warn('Error checking admin status or user is not an admin');
      return false;
    }
    
    return !!data.is_admin;
  } catch (err) {
    console.error('Failed to check if user is admin:', err);
    return false;
  }
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
  currentBrand: Brand,
  isAdmin: boolean = false
): Promise<void> => {
  if (!userId) {
    console.warn('No user ID provided for theme storage');
    return;
  }

  try {
    if (isAdmin) {
      // Admin is updating the global theme - update it in admin_themes table
      const { error } = await supabase
        .from('admin_themes')
        .upsert({
          admin_id: userId,
          colors,
          current_font: currentFont,
          font_sizes: fontSizes,
          font_weights: fontWeights,
          typography_scale: typographyScale,
          brands,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'admin_id'
        });

      if (error) {
        console.error('Error saving admin theme to Supabase:', error);
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
    } else {
      // Regular user is just saving their brand preference
      const { error } = await supabase
        .from('user_themes')
        .upsert({
          user_id: userId,
          current_brand: currentBrand,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving user theme to Supabase:', error);
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

// Fetch theme data from Supabase - different logic for admin vs regular user
export const fetchThemeFromSupabase = async (userId: string | undefined): Promise<{
  colors: ThemeColors,
  currentFont: string,
  fontSizes: FontSizes,
  fontWeights: FontWeights,
  typographyScale: TypographyScale,
  brands: Brand[],
  currentBrand: Brand,
  isAdmin: boolean
} | null> => {
  if (!userId) {
    console.warn('No user ID provided for theme retrieval');
    return null;
  }

  try {
    // First check if user is an admin
    const isAdmin = await checkIfUserIsAdmin(userId);
    
    // Get the global theme settings (created by admins)
    const { data: adminThemeData, error: adminThemeError } = await supabase
      .from('admin_themes')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
      
    if (adminThemeError) {
      console.warn('No admin theme data found in Supabase');
      // If no admin theme exists, fall back to defaults + local storage
      const localTheme = getThemeFromLocalStorage();
      return {
        ...localTheme,
        isAdmin
      };
    }
    
    // Get user's brand preference (if they have one)
    let currentBrand: Brand;
    if (isAdmin) {
      // Admin gets full control
      currentBrand = adminThemeData.brands[0] || initialBrands[0];
    } else {
      // Regular user - check if they have a saved brand preference
      const { data: userData, error: userError } = await supabase
        .from('user_themes')
        .select('current_brand')
        .eq('user_id', userId)
        .single();
        
      if (userError || !userData) {
        // No saved preference, use first brand from admin theme
        currentBrand = adminThemeData.brands[0] || initialBrands[0];
      } else {
        // User has a saved brand preference
        currentBrand = userData.current_brand;
        
        // Validate that the brand exists in admin theme
        const brandExists = adminThemeData.brands.some((b: Brand) => b.id === currentBrand.id);
        if (!brandExists) {
          // If brand no longer exists (admin deleted it), use first available brand
          currentBrand = adminThemeData.brands[0] || initialBrands[0];
        }
      }
    }

    return {
      colors: adminThemeData.colors,
      currentFont: adminThemeData.current_font,
      fontSizes: adminThemeData.font_sizes,
      fontWeights: adminThemeData.font_weights,
      typographyScale: adminThemeData.typography_scale,
      brands: adminThemeData.brands,
      currentBrand,
      isAdmin
    };
  } catch (err) {
    console.error('Failed to fetch theme from Supabase:', err);
    const localTheme = getThemeFromLocalStorage();
    return {
      ...localTheme,
      isAdmin: false
    };
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
