"use client";

import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button"; // Assuming you have your Button component

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'dark' ? "Light" : "Dark"} Mode
    </Button>
  );
};