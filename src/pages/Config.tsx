
import { useState } from "react";
import { useNavigate } from "react-router";
import { LogOut, LockKeyhole, Monitor, Sun, Moon } from "lucide-react";

import { useAuth } from "../auth/AuthContext";
import { useTheme, type ThemeMode } from "../context/ThemeContext";
import ChangePasswordModal from "../components/settings/ChangePassword";
import { toast } from "react-toastify";
import type { SelectOption } from "../components/ui/CustomSelect";
import CustomSelect from "../components/ui/CustomSelect";

const themeOptions: SelectOption<ThemeMode>[] = [
   {
      value: "light",
      label: "Claro",
      icon: Sun,
   },
   {
      value: "dark",
      label: "Oscuro",
      icon: Moon,
   },
   {
      value: "system",
      label: "Sistema",
      icon: Monitor,
   },
];

export default function Config() {
   const { logout } = useAuth();
   const { theme, setTheme } = useTheme();
   const navigate = useNavigate();

   const [showPasswordModal, setShowPasswordModal] = useState(false);

   const handleLogout = () => {
      logout();
      toast.success("¡Se ha cerrado la sesión!");
      void navigate("/login", { replace: true });
   };

   return (
      <div className="mx-auto px-10 py-10 max-w-4xl space-y-6">
         <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
               <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  General
               </h2>

               <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Administra las preferencias y tu cuenta.
               </p>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
               {/* Modo de pantalla */}
               <div className="flex flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                     <Monitor className="text-slate-500" size={22} />

                     <div>
                        <h3 className="font-medium text-slate-800 dark:text-white">
                           Modo de pantalla
                        </h3>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                           Personaliza la apariencia de la aplicación.
                        </p>
                     </div>
                  </div>

                  <CustomSelect
   value={theme}
   options={themeOptions}
   onChange={setTheme}
   ariaLabel="Tema de pantalla"
   className="w-48"
/>
               </div>

               {/* Cambiar contraseña */}
               <div className="flex flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                     <LockKeyhole className="text-slate-500" size={22} />

                     <div>
                        <h3 className="font-medium text-slate-800 dark:text-white">
                           Contraseña
                        </h3>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                           Actualiza la contraseña de tu cuenta.
                        </p>
                     </div>
                  </div>

                  <button
                     type="button"
                     onClick={() => setShowPasswordModal(true)}
                     className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                     Cambiar contraseña
                  </button>
               </div>

               {/* Cerrar sesión */}
               <div className="flex flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                     <LogOut className="text-red-500" size={22} />

                     <div>
                        <h3 className="font-medium text-slate-800 dark:text-white">
                           Cerrar sesión
                        </h3>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                           Finaliza tu sesión en este dispositivo.
                        </p>
                     </div>
                  </div>

                  <button
                     type="button"
                     onClick={handleLogout}
                     className="cursor-pointer rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
                  >
                     Cerrar sesión
                  </button>
               </div>
            </div>
         </section>

         <ChangePasswordModal
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
         />
      </div>
   );
}
