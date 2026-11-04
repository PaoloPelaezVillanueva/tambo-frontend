import { BriefcaseBusiness, House, Package, ReceiptText, Settings, Store, UsersRound } from "lucide-react";
import { NavLink } from "react-router";

const navigation = [
   {
      name: "Punto de venta",
      path: "/pos",
      icon: House
   },
   {
      name: "Productos",
      path: "/products",
      icon: Package
   },
   {
      name: "Ventas",
      path: "/sales",
      icon: ReceiptText
   },
   {
      name: "Clientes",
      path: "/clients",
      icon: BriefcaseBusiness
   },
   {
      name: "Usuarios",
      path: "/users",
      icon: UsersRound
   }
]

export default function Sidebar() {
   return (
      <aside className="flex h-full w-17 shrink-0 flex-col items-center overflow-hidden border-r border-slate-200 bg-white py-5 dark:border-slate-800 dark:bg-slate-900">
         <div className="mb-10 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
            <Store size={22} className="dark:text-purple-200" />
         </div>

         { /* Navegación */ }
         <nav className="flex min-h-0 flex-1 flex-col gap-4">
            {
               navigation.map(({name, path, icon: Icon}) => (
                  <NavLink
                     key={path}
                     to={path}
                     end={path === "/pos"}
                     className={({isActive}) =>
                        `flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors md:justify-start ${
                           isActive
                              ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                        }`
                     }
                     title={name}
                  >
                     <Icon size={21} />
                  </NavLink>
               ))
            }
         </nav>

         <NavLink
            to={"/config"}
            className={({isActive}) =>
               `flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors md:justify-start ${
                  isActive
                     ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                     : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
               }`
            }
            title="Configuración"
         >
            <Settings size={21} />
         </NavLink>
      </aside>
   )
}