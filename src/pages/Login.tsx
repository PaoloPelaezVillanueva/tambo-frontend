import { useState, type SubmitEvent } from "react";
import { Eye, EyeOff, Lock, User as UserIcon, Store } from "lucide-react";
import { toast } from "react-toastify";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import ThemeToggle from "../components/layout/ThemeToggle";

export default function LoginPage() {
   const { login } = useAuth();
   const navigate = useNavigate();

   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!username.trim() || !password) {
         toast.warning("Completa todos los campos.");
         return;
      }

      try {
         setLoading(true);
         
         await login({user: username.trim(), password});

         toast.success("¡Bienvenido! Ingresando al POS...");
         void navigate("/pos", { replace: true });
      } catch (error) {
         toast.error(
            error instanceof Error
               ? error.message
               : "No se pudo iniciar sesión.",
         );
      } finally {
         setLoading(false);
      }
   }

   return (
      <>
         <ThemeToggle />

         <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
               <div className="mb-8 flex flex-col items-center">
                  <img
                     src={Logo}
                     alt="Logo Tambo"
                     className="mb-5 h-16 object-contain"
                  />

                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bienvenido</h1>

                  <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                     Inicia sesión para acceder al punto de venta.
                  </p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                     <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Usuario
                     </label>

                     <div className="relative">
                        <UserIcon size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                           id="username"
                           type="text"
                           value={username}
                           onChange={(event) => setUsername(event.target.value)}
                           placeholder="Ingresa tu usuario"
                           autoComplete="username"
                           required
                           disabled={loading}
                           className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-900/40 dark:disabled:bg-slate-900"
                        />
                     </div>
                  </div>

                  <div>
                     <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Contraseña
                     </label>

                     <div className="relative">
                        <Lock size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>

                        <input
                           id="password"
                           type={showPassword ? "text" : "password"}
                           value={password}
                           onChange={(event) => setPassword(event.target.value)}
                           placeholder="Ingresa tu contraseña"
                           autoComplete="current-password"
                           required
                           disabled={loading}
                           className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-900/40 dark:disabled:bg-slate-900"
                        />

                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           disabled={loading}
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

                  <button
                     type="submit"
                     disabled={loading}
                     className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900"
                  >
                     {loading ? (
                        <>
                           <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                           {" "}Iniciando sesión...
                        </>
                     ) : (
                        <>
                           <Store size={19} />
                           Iniciar sesión
                        </>
                     )}
                  </button>
               </form>

               <p className="mt-8 text-center text-xs text-slate-400">
                  Sistema de punto de venta · Acceso exclusivo para colaboradores
               </p>
            </div>
         </main>
      </>
   );
}
