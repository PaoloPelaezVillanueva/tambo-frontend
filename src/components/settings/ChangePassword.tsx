import { Eye, EyeOff, X } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { toast } from "react-toastify";
import { changePassword } from "../../services/authService";

interface ChangePasswordModalProps {
   isOpen: boolean;
   onClose: () => void;
}

interface FormInputProps {
   id: string;
   label: string;
   value: string;
   autoComplete: string;
   disabled: boolean;
   minLength?: number;
   onChange: (value: string) => void;
}

function FormInput({id, label, value, autoComplete, disabled, minLength, onChange}: Readonly<FormInputProps>) {
   const [showPassword, setShowPassword] = useState(false);

   return (
      <div>
         <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
         </label>

         <div className="relative">
            <input
               id={id}
               type={showPassword ? "text" : "password"}
               autoComplete={autoComplete}
               value={value}
               onChange={(event) => onChange(event.target.value)}
               disabled={disabled}
               minLength={minLength}
               required
               className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-purple-900/40"
            />

            <button
               type="button"
               onClick={() => setShowPassword((previous) => !previous)}
               disabled={disabled}
               aria-label={
                  showPassword
                     ? "Ocultar contraseña"
                     : "Mostrar contraseña"
               }
               className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
            >
               {showPassword ? (
                  <EyeOff size={19} />
               ) : (
                  <Eye size={19} />
               )}
            </button>
         </div>
      </div>
   );
}

export default function ChangePasswordModal({ isOpen, onClose }: Readonly<ChangePasswordModalProps>) {
   const [currentPassword, setCurrentPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [loading, setLoading] = useState(false);

   function resetForm() {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
   }

   function handleClose() {
      if (loading) return;

      resetForm();
      onClose();
   }

   if (!isOpen) return null;

   const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!currentPassword || !newPassword || !confirmPassword) {
         toast.warning("Completa todos los campos.");
         return;
      }

      if (newPassword.length < 6) {
         toast.warning("La nueva contraseña debe tener al menos 6 carácteres.");
         return;
      }

      if (newPassword === currentPassword) {
         toast.warning("La nueva contraseña debe ser diferente a la actual.");
         return;
      }

      if (newPassword !== confirmPassword) {
         toast.warning("Las contraseñas nuevas no coinciden.");
         return;
      }
      
      try {
         setLoading(true);

         await changePassword({currentPassword, newPassword, confirmPassword});

         toast.success("Contraseña actualizada correctamente.");

         resetForm();
         onClose();
      } catch (error) {
         toast.error(error instanceof Error
            ? error.message
            : "No se pudo actualizar la contraseña.",
         );
      } finally {
         setLoading(false);
      }
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Cerrar modal"
            className="absolute inset-0 cursor-default bg-black/50 disabled:cursor-not-allowed"
         />
         <div
            aria-modal="true"
            aria-labelledby="password-modal-title"
            aria-busy={loading}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
         >
            <div className="mb-6 flex items-center justify-between">
               <h2
                  id="password-modal-title"
                  className="text-lg font-semibold text-slate-800 dark:text-white"
               >
                  Cambiar contraseña
               </h2>

               <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  aria-label="Cerrar modal"
                  className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800"
               >
                  <X size={20} />
               </button>
            </div>

            <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
               <FormInput
                  id="current-password"
                  label="Contraseña actual"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  autoComplete="current-password"
                  disabled={loading}
               />

               <FormInput
                  id="new-password"
                  label="Nueva contraseña"
                  value={newPassword}
                  onChange={setNewPassword}
                  autoComplete="new-password"
                  minLength={6}
                  disabled={loading}
               />

               <FormInput
                  id="confirm-password"
                  label="Confirmar nueva contraseña"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  autoComplete="new-password"
                  disabled={loading}
               />

               <div className="flex justify-end gap-3 pt-2">
                  <button
                     type="button"
                     onClick={handleClose}
                     disabled={loading}
                     className="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                     Cancelar
                  </button>

                  <button
                     type="submit"
                     disabled={loading}
                     className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                     {loading ? "Actualizando..." : "Guardar contraseña"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}