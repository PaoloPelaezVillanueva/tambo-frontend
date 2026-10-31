import type { ReactNode } from "react";
import { useAuth } from "../../auth/AuthContext";
import Logo from "../../assets/logo.png";

interface PageHeaderProps {
   title: string;
   children?: ReactNode;
}

export default function PageHeader({ title, children }: Readonly<PageHeaderProps>) {
   const { user } = useAuth();

   return (
      <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
         <div>
            <img src={Logo} alt="Logo tambo" className="h-12 object-contain" />
            <p className="text-sm text-slate-500 font-semibold">{ title }</p>
         </div>

         <div className="flex items-center p-4">
            { children }

            <div className="text-right">
               <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {user?.name} {user?.lastname}
               </p>

               <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.role.id === 1 ? 'Admin': 'Colaborador'}
               </p>
            </div>
         </div>
      </header>
   )
}