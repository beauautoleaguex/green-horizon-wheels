
import React from 'react';
import { ColorRampEditor } from '@/components/theme/ColorRampEditor';
import { FontSelector } from '@/components/theme/FontSelector';
import { FontSizesEditor } from '@/components/theme/FontSizesEditor';
import { FontWeightsEditor } from '@/components/theme/FontWeightsEditor';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTheme } from '@/contexts/theme/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Palette, Save, RotateCcw, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { BrandSelector } from '@/components/theme/BrandSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ThemeEditor: React.FC = () => {
  const { 
    colors, 
    fonts, 
    currentFont, 
    fontSizes, 
    fontWeights,
    currentTypographyScale,
    brands,
    currentBrand,
    updateColor,
    updateColorRamp,
    updateFont,
    updateFontSize,
    updateFontWeight,
    updateTypographyScale,
    switchBrand,
    saveTheme,
    resetTheme,
    updateBrandColor,
    updateBrandFont,
    isAdmin
  } = useTheme();

  const handleSave = () => {
    saveTheme();
    toast({
      title: "Theme saved",
      description: isAdmin 
        ? "Theme settings have been saved for all users" 
        : "Your brand preference has been saved"
    });
  };

  const handleReset = () => {
    resetTheme();
    toast({
      title: "Theme reset",
      description: "Your theme has been reset to default settings."
    });
  };
  
  const handleBrandChange = (brandId: string) => {
    switchBrand(brandId);
  };
  
  const handleColorChange = (color: string) => {
    updateBrandColor(currentBrand.id, color);
  };
  
  const handleFontChange = (font: string) => {
    updateBrandFont(currentBrand.id, font);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 border-b dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-brand-green" />
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Theme Editor</h1>
            </div>
            <div className="flex gap-2 items-center">
              <ThemeToggle />
              {isAdmin && (
                <Button variant="outline" onClick={handleReset} className="gap-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              )}
              <Button onClick={handleSave} className="gap-1">
                <Save className="h-4 w-4" />
                {isAdmin ? "Save Theme" : "Save Preference"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Homepage
          </Link>
          
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin/brands" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                <Users className="h-4 w-4" />
                Manage Brands
              </Link>
            )}
            
            <BrandSelector 
              brands={brands}
              currentBrand={currentBrand}
              fonts={fonts}
              onBrandChange={handleBrandChange}
              onColorChange={handleColorChange}
              onFontChange={handleFontChange}
            />
          </div>
        </div>

        {isAdmin ? (
          <Alert className="mb-6">
            <AlertTitle>Admin Mode</AlertTitle>
            <AlertDescription>
              You are in administrator mode. Changes made here will affect all users of the application.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6">
            <AlertTitle>User Mode</AlertTitle>
            <AlertDescription>
              You can select a brand theme, but cannot modify brand settings or color ramps.
            </AlertDescription>
          </Alert>
        )}

        {isAdmin ? (
          <Tabs defaultValue="colors">
            <TabsList className="mb-6">
              <TabsTrigger value="colors">Color Ramps</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
            </TabsList>
            
            <TabsContent value="colors">
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(colors).map(([colorName, scale]) => (
                  <ColorRampEditor
                    key={colorName}
                    colorName={colorName}
                    scale={scale}
                    onColorChange={updateColor}
                    onRampChange={updateColorRamp}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="typography">
              <div className="grid grid-cols-1 gap-6">
                <FontSelector 
                  fonts={fonts}
                  currentFont={currentFont}
                  onFontChange={updateFont}
                />
                
                <FontSizesEditor
                  fontSizes={fontSizes}
                  onFontSizeChange={updateFontSize}
                  currentFont={currentFont}
                  currentTypographyScale={currentTypographyScale}
                  onTypographyScaleChange={updateTypographyScale}
                />
                
                <FontWeightsEditor
                  fontWeights={fontWeights}
                  onFontWeightChange={updateFontWeight}
                  currentFont={currentFont}
                />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          // For non-admin users, just show their selected brand
          <div className="mt-6 p-6 border rounded-lg bg-white dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-4">Selected Brand Theme</h3>
            
            <div className="flex items-center gap-4">
              {currentBrand.logo && (
                <img 
                  src={currentBrand.logo} 
                  alt={`${currentBrand.name} logo`} 
                  className="w-16 h-16 object-contain"
                />
              )}
              
              <div>
                <p className="font-semibold">{currentBrand.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: currentBrand.primaryColor }}
                  />
                  <span className="text-sm">{currentBrand.primaryColor}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeEditor;
