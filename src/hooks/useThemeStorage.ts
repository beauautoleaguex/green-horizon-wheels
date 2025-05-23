
import { useState, useEffect } from 'react';
import { ThemeColors, FontSizes, FontWeights, ThemeMode, TypographyScale, Brand } from '../types/theme';
import { 
  initialColors, 
  initialFonts, 
  initialFontSizes, 
  initialFontWeights, 
  initialTypographyScale,
  initialBrands,
} from '../constants/themeDefaults';
import {
  saveThemeToSupabase,
  fetchThemeFromSupabase,
  getThemeFromLocalStorage,
  getCurrentUserId,
  checkIfUserIsAdmin
} from '@/services/themeStorageService';
import { useToast } from '@/hooks/use-toast';

export const useThemeStorage = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize with defaults, will be updated after fetching
  const [colors, setColors] = useState<ThemeColors>(initialColors);
  const [fonts] = useState<string[]>(initialFonts);
  const [currentFont, setCurrentFont] = useState<string>(initialFonts[0]);
  const [fontSizes, setFontSizes] = useState<FontSizes>(initialFontSizes);
  const [fontWeights, setFontWeights] = useState<FontWeights>(initialFontWeights);
  // Always set mode to 'light', ignoring any saved preference
  const [mode, setMode] = useState<ThemeMode>('light');
  const [currentTypographyScale, setCurrentTypographyScale] = useState<TypographyScale>(initialTypographyScale);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [currentBrand, setCurrentBrand] = useState<Brand>(initialBrands[0]);

  // Fetch user ID and theme data on first load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // Get current user ID
        const uid = await getCurrentUserId();
        setUserId(uid);
        
        // If we have a user ID, fetch theme from Supabase
        if (uid) {
          const themeData = await fetchThemeFromSupabase(uid);
          if (themeData) {
            setColors(themeData.colors);
            setCurrentFont(themeData.currentFont);
            setFontSizes(themeData.fontSizes);
            setFontWeights(themeData.fontWeights);
            setCurrentTypographyScale(themeData.typographyScale);
            setBrands(themeData.brands);
            setCurrentBrand(themeData.currentBrand);
            setIsAdmin(themeData.isAdmin);
          } else {
            // If no Supabase data, try localStorage
            const localTheme = getThemeFromLocalStorage();
            setColors(localTheme.colors);
            setCurrentFont(localTheme.currentFont);
            setFontSizes(localTheme.fontSizes);
            setFontWeights(localTheme.fontWeights);
            setCurrentTypographyScale(localTheme.typographyScale);
            setBrands(localTheme.brands);
            setCurrentBrand(localTheme.currentBrand);
            
            // Check if user is admin
            const adminStatus = await checkIfUserIsAdmin(uid);
            setIsAdmin(adminStatus);
          }
        } else {
          // No user ID, use localStorage
          const localTheme = getThemeFromLocalStorage();
          setColors(localTheme.colors);
          setCurrentFont(localTheme.currentFont);
          setFontSizes(localTheme.fontSizes);
          setFontWeights(localTheme.fontWeights);
          setCurrentTypographyScale(localTheme.typographyScale);
          setBrands(localTheme.brands);
          setCurrentBrand(localTheme.currentBrand);
        }
      } catch (error) {
        console.error('Error initializing theme:', error);
        toast({
          title: "Error loading theme",
          description: "Falling back to default theme",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, [toast]);

  // Save theme to Supabase and localStorage
  const saveTheme = async () => {
    try {
      await saveThemeToSupabase(
        userId,
        colors,
        currentFont,
        fontSizes,
        fontWeights,
        currentTypographyScale,
        brands,
        currentBrand,
        isAdmin // Pass admin status to save correctly
      );
      
      toast({
        title: "Theme saved",
        description: isAdmin 
          ? "Theme configuration has been saved for all users" 
          : "Your brand preference has been saved",
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error saving theme",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  // Reset theme to initial values - only affects admins
  const resetTheme = () => {
    if (!isAdmin) {
      console.warn('Only admins can reset the theme');
      return;
    }
    
    setColors(initialColors);
    setCurrentFont(initialFonts[0]);
    setFontSizes(initialFontSizes);
    setFontWeights(initialFontWeights);
    setCurrentTypographyScale(initialTypographyScale);
    setBrands(initialBrands);
    setCurrentBrand(initialBrands[0]);
  };

  return {
    colors,
    setColors,
    fonts,
    currentFont,
    setCurrentFont,
    fontSizes,
    setFontSizes,
    fontWeights,
    setFontWeights,
    mode,
    setMode,
    currentTypographyScale,
    setCurrentTypographyScale,
    brands,
    setBrands,
    currentBrand,
    setCurrentBrand,
    saveTheme,
    resetTheme,
    isLoading,
    userId,
    isAdmin
  };
};
