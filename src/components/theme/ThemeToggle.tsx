
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme/ThemeContext";

export function ThemeToggle() {
  const { toggleMode } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMode}
      className="border-gray-200"
      title="Light mode is always enabled"
      disabled={true} // Disable the button since we always use light mode
    >
      <Sun className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Light theme enabled</span>
    </Button>
  );
}
