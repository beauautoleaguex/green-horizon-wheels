
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMode}
      className="border-gray-200 dark:border-gray-700"
      title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {mode === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
