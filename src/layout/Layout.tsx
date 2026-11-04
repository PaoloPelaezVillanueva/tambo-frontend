import { Outlet, useLocation } from "react-router"
import Sidebar from "../components/layout/Sidebar";
import PageHeader from "../components/layout/PageHeader";

const pageTitles: Record<string, string> = {
   "/pos": "Punto de venta",
   "/config": "Configuración"
}

export default function Layout() {
   const { pathname } = useLocation();

   const title = pageTitles[pathname] ?? "Tambo";

   return (
      <div className="flex h-dvh w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
         <Sidebar />

         <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <PageHeader title={title} />

            {/* Contenido de la ruta */}
            <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
               <Outlet />
            </div>
         </div>
      </div>
   )
}