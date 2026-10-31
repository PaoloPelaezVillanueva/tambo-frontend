import { X } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { toast } from "react-toastify";

interface ChangePasswordModalProps {
   isOpen: boolean;
   onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: Readonly<ChangePasswordModalProps>) {
   const [currentPassword, setCurrentPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");

   if (!isOpen) return null;

   const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!currentPassword || !newPassword || !confirmPassword) {
         toast.warning("Completa todos los campos.");
         return;
      }

      if (newPassword !== confirmPassword) {
         toast.warning("Las contraseñas nuevas no coinciden.");
         return;
      }

      toast.info("El formulario está listo. Falta conectarlo al endpoint de cambio de contraseña.");
   };

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
         <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute inset-0 cursor-default bg-black/50"
         />
         <div
            aria-modal="true"
            aria-labelledby="password-modal-title"
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
                  onClick={onClose}
                  className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Cerrar modal"
               >
                  <X size={20} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium">
                     Contraseña actual
                  </label>
                  <input
                     id="password"
                     type="password"
                     autoComplete="current-password"
                     value={currentPassword}
                     onChange={(event) => setCurrentPassword(event.target.value)}
                     className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-purple-500 dark:border-slate-700 dark:bg-slate-800"
                  />
               </div>

               <div>
                  <label htmlFor="new-password" className="mb-1 block text-sm font-medium">
                     Nueva contraseña
                  </label>
                  <input
                     id="new-password"
                     type="password"
                     autoComplete="new-password"
                     value={newPassword}
                     onChange={(event) => setNewPassword(event.target.value)}
                     className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-purple-500 dark:border-slate-700 dark:bg-slate-800"
                  />
               </div>

               <div>
                  <label htmlFor="repeat-password" className="mb-1 block text-sm font-medium">
                     Confirmar nueva contraseña
                  </label>
                  <input
                     id="repeat-password"
                     type="password"
                     autoComplete="new-password"
                     value={confirmPassword}
                     onChange={(event) => setConfirmPassword(event.target.value)}
                     className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-purple-500 dark:border-slate-700 dark:bg-slate-800"
                  />
               </div>

               <div className="flex justify-end gap-3 pt-2">
                  <button
                     type="button"
                     onClick={onClose}
                     className="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                     Cancelar
                  </button>

                  <button
                     type="submit"
                     className="cursor-pointer rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                  >
                     Guardar contraseña
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}