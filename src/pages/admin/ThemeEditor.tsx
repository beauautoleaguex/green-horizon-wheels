
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
    resetTheme
  } = useTheme();

  const handleSave = () => {
    saveTheme();
    toast({
      title: "Theme saved",
      description: "Your theme settings have been saved successfully."
    });
  };

  const handleReset = () => {
    resetTheme();
    toast({
      title: "Theme reset",
      description: "Your theme has been reset to default settings."
    });
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
              <Button variant="outline" onClick={handleReset} className="gap-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button onClick={handleSave} className="gap-1">
                <Save className="h-4 w-4" />
                Save Theme
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
            <Link to="/admin/brands" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              <Users className="h-4 w-4" />
              Manage Brands
            </Link>
            
            <div className="w-64">
              <Select
                value={currentBrand.id}
                onValueChange={switchBrand}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: brand.primaryColor }}
                        />
                        {brand.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default ThemeEditor;
