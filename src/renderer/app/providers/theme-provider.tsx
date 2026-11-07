import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "@/hooks/use-theme";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children, defaultTheme = "system", storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey);
    return storedTheme === "dark" || storedTheme === "light" || storedTheme === "system"
      ? storedTheme
      : defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      root.classList.remove("light", "dark");
      root.classList.add(theme === "system" ? preference.matches ? "dark" : "light" : theme);
    };

    applyTheme();
    if (theme === "system") {
      preference.addEventListener("change", applyTheme);
      return () => preference.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme: (value) => {
        localStorage.setItem(storageKey, value);
        setTheme(value);
      },
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
