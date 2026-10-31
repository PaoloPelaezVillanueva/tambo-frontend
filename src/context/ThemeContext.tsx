import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
   theme: ThemeMode;
   resolvedTheme: ResolvedTheme;
   setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function getInitialTheme(): ThemeMode {
   const savedTheme = localStorage.getItem("theme");

   if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") return savedTheme;

   return "system";
}

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
   const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
   const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
      if (theme !== "system") return theme;

      return window.matchMedia("(prefers-color-scheme: dark)").matches
         ? "dark"
         : "light";
   });

   useEffect(() => {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const applyTheme = () => {
         const isDark = theme === "dark" || (theme === "system" && mediaQuery.matches);

         const newTheme = isDark ? "dark" : "light";

         setResolvedTheme(newTheme);
         document.documentElement.classList.toggle("dark", isDark);
      };

      applyTheme();
      localStorage.setItem("theme", theme);

      if (theme === "system") {
         mediaQuery.addEventListener("change", applyTheme);
      }

      return () => {
         mediaQuery.removeEventListener("change", applyTheme);
      };
   }, [theme]);

   const contextValue = useMemo(
      () => ({ theme, setTheme, resolvedTheme }),
      [theme, setTheme, resolvedTheme]
   );

   return (
      <ThemeContext.Provider value={contextValue}>
         {children}
      </ThemeContext.Provider>
   );
}

export function useTheme() {
   const context = useContext(ThemeContext);

   if (!context) {
      throw new Error("useTheme debe utilizarse dentro de ThemeProvider.");
   }

   return context;
}
