
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
   const { resolvedTheme, setTheme } = useTheme();

   const isDark = resolvedTheme === "dark";

   const handleToggle = () => {
      setTheme(isDark ? "light" : "dark");
   };

   return (
      <button
         type="button"
         onClick={handleToggle}
         title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
         aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
         className="cursor-pointer fixed right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
         {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
   );
}
