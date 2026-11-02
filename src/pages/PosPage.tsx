import { useMemo, useState } from "react";
import {
   Package,
   Search,
   Plus,
   Minus,
   Trash2,
   ShoppingCart,
   CreditCard,
   X
} from "lucide-react";
import type { Category } from "../types/category";
import { CurrencyFormatter } from "../helpers/currencyHelper";
import type { SaleRequest } from "../types/requests/saleRequest";
import { createSale } from "../services/saleService";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import { usePosStore } from "../store/posStore";
import { useCartStore } from "../store/cartStore";

const productEmojis: Record<number, string> = {
   1: "🌾",
   2: "🥛",
   3: "🥤",
   4: "🍞",
   6: "🍬",
   7: "🫗",
   8: "🍫",
};

export default function PosPage() {
   const { user } = useAuth();

   const categories = usePosStore((state) => state.categories);
   const products = usePosStore((state) => state.products);
   const clients = usePosStore((state) => state.clients);

   const loadingInitialData = usePosStore((state) => state.loadingInitialData);
   const initialized = usePosStore((state) => state.initialized);
   const error = usePosStore((state) => state.error);
   const loadInitialData = usePosStore((state) => state.loadInitialData);
   const refreshProducts = usePosStore((state) => state.refreshProducts);

   const [search, setSearch] = useState("");
   const [clientSearch, setClientSearch] = useState("");

   const [selectedCategory, setSelectedCategory] = useState<Category>({id: 0, category: 'Todos'});
   const [showClientDropdown, setShowClientDropdown] = useState(false);

   const [processingSale, setProcessingSale] = useState(false);
   
   const {items, totalItems, total, selectedClient, setSelectedClient, addItem, decreaseItem, increaseItem, removeItem, clearCart} = useCartStore();

   const filteredProducts = useMemo(() => {
      return products.filter((product) => {
         const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())

         const matchesCategory = selectedCategory.id === 0 || product.category.category === selectedCategory?.category;

         return matchesSearch && matchesCategory;
      });
   }, [products, search, selectedCategory]);

   const filteredClients = useMemo(() => {
      const query = clientSearch.trim().toLowerCase();

      if (!query) return [];

      return clients.filter((client) => {
         const fullName = `${client.name} ${client.lastname}`.toLowerCase();
         const reverseName = `${client.lastname} ${client.name}`.toLowerCase();

         return (
            fullName.includes(query) ||
            reverseName.includes(query) ||
            client.dni.includes(query)
         );
      });
   }, [clients, clientSearch]);

   async function processSale() {
      if (processingSale) return;

      if (items.length === 0) {
         toast.warning("Agrega productos antes de cobrar.");
         return;
      }

      if (!user) {
         toast.error("No hay una sesión activa. Inicia sesión nuevamente.");
         return;
      }

      const request: SaleRequest = {
         client: selectedClient?.id ?? null,
         user: user.id,
         details: items.map((item) => ({
            product: item.product.id,
            quantity: item.quantity
         }))
      };

      try {
         setProcessingSale(true);

         await createSale(request);

         clearCart();
         setSelectedClient(null);
         setClientSearch("");
         setShowClientDropdown(false);

         try {
            toast.success("Venta registrada correctamente.");

            await refreshProducts();
         } catch (refreshError) {
            console.error("Error al actualizar el producto:", refreshError);
            toast.warning("La venta se registró correctamente, pero no se pudo actualizar la lista de productos.")
         }
      } catch (error) {
         console.error("Error al registrar la venta:", error);
         
         toast.error(
            error instanceof Error
               ? error.message
               : "No se pudo registrar la venta."
         );
      } finally {
         setProcessingSale(false);
      }
   }

   if(loadingInitialData || (!initialized && !error)) {
      return (
         <div className="flex h-full min-h-0 items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col items-center gap-4">
               <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600 dark:border-purple-400 dark:border-t-purple-900" />

               <p className="text-sm font-medium text-slate-600 dark:text-white">
                  Cargando POS de venta...
               </p>

               <p className="text-xs text-slate-400">
                  Preparando productos, categorías y clientes.
               </p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 bg-slate-50 px-4">
            <p className="text-lg font-medium text-red-600">
               ¡Ha ocurrido un error!
            </p>

            <p className="text-center text-sm text-slate-600">
               {error}
            </p>

            <button
               type="button"
               onClick={() => void loadInitialData()}
               className="cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
            >
               Reintentar
            </button>
         </div>
      );
   }

   return (
      <main className="flex h-full min-h-0 min-w-0 overflow-hidden bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
         {/* Catálogo */}
         <div className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
            <section className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain custom-scrollbar p-5 sm:p-6">
               <div>
                  <h1 className="text-xl font-bold">Nueva venta</h1>
                  <p className="mt-1 text-sm text-slate-500">
                     Busca y selecciona los productos.
                  </p>
               </div>

               {/* Búsqueda */}
               <div className="relative">
                  <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"/>
                  <input
                     value={search}
                     onChange={(event) => setSearch(event.target.value)}
                     placeholder="Buscar producto..."
                     className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                  />
               </div>

               {/* Categorías */}
               <div className="flex gap-2 pb-1">
                  {categories.map((item) => (
                     <button
                        key={item.id}
                        onClick={() => setSelectedCategory(item)}
                        className={`cursor-pointer shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                           selectedCategory?.id === item.id
                              ? "bg-purple-600 text-white"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                     >
                        {item.category}
                     </button>
                  ))}
               </div>

               {/* Productos */}
               <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => {
                     const cartItem = items.find(
                        (item) => item.product.id === product.id,
                     );

                     const outOfStock =
                        product.stock === 0 ||
                        (cartItem?.quantity ?? 0) >= product.stock;

                     return (
                        <button
                           key={product.id}
                           onClick={() => addItem(product)}
                           disabled={processingSale || outOfStock}
                           className="cursor-pointer group flex min-h-47.5 flex-col rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-purple-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-700 dark:hover:shadow-purple-950/20"
                        >
                           <div className="mb-3 flex h-24 w-full items-center justify-center rounded-lg bg-slate-50 text-5xl dark:bg-slate-800">
                              {productEmojis[product.category.id] ?? "📦"}
                           </div>

                           <h2 className="mt-1 line-clamp-2 text-md font-semibold mb-2">
                              {product.name}
                           </h2>

                           <div>
                              <span className="rounded-lg text-[12px] bg-purple-50 p-1.5 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300">
                                 {product.category.category}
                              </span>
                           </div>


                           <h3 className="pt-3 text-sm text-slate-500 dark:text-slate-400">
                              {product.description}
                           </h3>

                           <div className="mt-auto flex w-full items-center justify-between gap-2 pt-3">
                              <span className="font-bold text-purple-600 dark:text-purple-400">
                                 {CurrencyFormatter.format(product.cost)}
                              </span>

                              <span className="text-[12px] text-slate-500 dark:text-slate-400">
                                 Stock: {product.stock}
                              </span>
                           </div>
                        </button>
                     );
                  })}
               </div>

               {filteredProducts.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                     <Package className="mx-auto mb-3 text-slate-400 dark:text-slate-500" size={32} />
                     <p className="font-medium">No se encontraron productos</p>
                     <p className="mt-1 text-sm text-slate-500">Prueba con otro nombre o categoría.</p>
                  </div>
               )}
            </section>
         </div>

         {/* Carrito */}
         <aside className="flex h-full min-h-0 w-85 shrink-0 flex-col overflow-hidden border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 xl:w-97.5">
            <div className="relative flex min-h-0 flex-1 flex-col">
               {/* Contenido del Carrito */}
               <div
                  inert={processingSale}
                  className={`flex min-h-0 flex-1 flex-col transition-opacity duration-200 ${processingSale ? "opacity-50" : ""}`}
               >
                  <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-slate-800">
                     <div>
                        <h2 className="text-lg font-bold">Venta actual</h2>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Pedido #0001 · {totalItems} unidades</p>
                     </div>

                     <button
                        onClick={clearCart}
                        disabled={items.length === 0}
                        className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                     >
                        Limpiar
                     </button>
                  </header>

                  {/* Lista de productos del carrito */}
                  <div className="min-h-0 flex-1 space-y-4 overflow-y-auto custom-scrollbar p-5">
                     {items.length === 0 ? (
                        <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
                           <div className="mb-3 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                              <ShoppingCart size={28} className="text-slate-400 dark:text-slate-500" />
                           </div>

                           <p className="font-semibold">Carrito vacío</p>
                           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Selecciona productos del catálogo.</p>
                        </div>
                     ) : (
                        items.map((item) => (
                           <div key={item.product.id} className="flex gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-2xl dark:bg-slate-800">
                                 {productEmojis[item.product.category.id] ?? "📦"}
                              </div>

                              <div className="min-w-0 flex-1">
                                 <h3 className="line-clamp-2 text-sm font-semibold">
                                    {item.product.name}
                                 </h3>

                                 <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {CurrencyFormatter.format(item.product.cost)}
                                 </p>

                                 <div className="mt-3 flex items-center gap-2">
                                    <button
                                       onClick={() => decreaseItem(item.product.id)}
                                       aria-label={`Disminuir ${item.product.name}`}
                                       className="cursor-pointer rounded-md border border-slate-200 p-1 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                    >
                                       <Minus size={14} />
                                    </button>

                                    <span className="min-w-5 text-center text-sm font-medium">
                                       {item.quantity}
                                    </span>

                                    <button
                                       onClick={() => increaseItem(item.product.id)}
                                       disabled={item.quantity >= item.product.stock}
                                       aria-label={`Aumentar ${item.product.name}`}
                                       className="cursor-pointer rounded-md border border-slate-200 p-1 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
                                    >
                                       <Plus size={14} />
                                    </button>

                                    <button
                                       onClick={() => removeItem(item.product.id)}
                                       aria-label={`Eliminar ${item.product.name}`}
                                       className="cursor-pointer ml-auto rounded-md p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                    >
                                       <Trash2 size={17} />
                                    </button>
                                 </div>
                              </div>

                              <p className="shrink-0 text-sm font-bold text-slate-800 dark:text-slate-100">
                                 {CurrencyFormatter.format(item.product.cost * item.quantity)}
                              </p>
                           </div>
                        ))
                     )}
                  </div>

                  {/* Cliente */}
                  <div className="relative shrink-0 border-t border-slate-200 p-5 dark:border-slate-800">
                     <label htmlFor="client-input" className="mb-3 block text-sm font-semibold">Cliente:</label>
                     {
                        selectedClient ? (
                           <div className="flex items-center justify-between gap-3 rounded-xl border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-950/30">
                              <div className="min-w-0">
                                 <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    {selectedClient.name} {selectedClient.lastname}
                                 </p>

                                 <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    DNI: {selectedClient.dni}
                                 </p>
                              </div>

                              <button
                                 type="button"
                                 onClick={() => {
                                    setSelectedClient(null);
                                    setClientSearch("");
                                    setShowClientDropdown(false);
                                 }}
                                 aria-label="Deseleccionar cliente"
                                 title="Quitar cliente"
                                 className="cursor-pointer shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-red-100 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                              >
                                 <X size={18} />
                              </button>
                           </div>
                        ) : (
                           <div className="relative">
                              <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                              <input
                                 id="client-input"
                                 type="text"
                                 value={clientSearch}
                                 onChange={(event) => {
                                    setClientSearch(event.target.value);
                                    setShowClientDropdown(true);
                                 }}
                                 onFocus={() => setShowClientDropdown(true)}
                                 onKeyDown={(event) => {
                                    if(event.key === "Escape") setShowClientDropdown(false);
                                 }}
                                 placeholder="Buscar cliente o dni..."
                                 autoComplete="off"
                                 className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                              />

                              {
                                 showClientDropdown && (
                                    <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-48 overflow-y-auto custom-scrollbar rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                                       {
                                          clientSearch.trim() === "" ? (
                                             <p className="px-4 py-3 text-center text-sm text-slate-500">
                                                Escribe un nombre o DNI para buscar.
                                             </p>
                                          ) : filteredClients.length > 0 ? (
                                             filteredClients.map((client) => (
                                                <button
                                                   key={client.id}
                                                   type="button"
                                                   onClick={() => {
                                                      setSelectedClient(client);
                                                      setClientSearch("");
                                                      setShowClientDropdown(false);
                                                   }}
                                                   className="flex w-full cursor-pointer flex-col gap-1 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-purple-50 dark:border-slate-800 dark:hover:bg-purple-950/40"
                                                >
                                                   <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                                      {client.name} {client.lastname}
                                                   </span>

                                                   <span className="text-xs text-slate-500 dark:text-slate-400">
                                                      DNI: {client.dni}
                                                   </span>
                                                </button>
                                             ))
                                          ) : (
                                             <p className="px-4 py-3 text-center text-sm text-slate-500 dark:text-slate-400">
                                                No se encontraron clientes.
                                             </p>
                                          )
                                       }
                                    </div>
                                 )
                              }
                           </div>
                        )
                     }
                  </div>

                  {/* Resumen y pago */}
                  <div className="shrink-0 space-y-4 border-t border-slate-200 p-5 dark:border-slate-800">
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                        <span className="font-medium">{CurrencyFormatter.format(total)}</span>
                     </div>

                     <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">Total a pagar</span>
                        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                           {CurrencyFormatter.format(total)}
                        </span>
                     </div>

                     <button
                        onClick={() => void processSale()}
                        disabled={items.length === 0 || processingSale}
                        className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
                     >
                        <CreditCard size={19} />
                        {processingSale ? "Registrando venta..." : "Procesar venta"}
                     </button>
                  </div>
               </div>
               {
                  processingSale && (
                     <div
                        className="absolute inset-0 z-60 flex flex-col items-center justify-center gap-4 bg-white/75 backdrop-blur-[2px] dark:bg-slate-950/75"
                        role="status"
                        aria-live="polite"
                     >
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600 dark:border-purple-900 dark:border-t-purple-400" />

                        <div className="text-center">
                           <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                              Registrando venta...
                           </p>

                           <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Espera mientras se procesa tu venta
                           </p>
                        </div>
                     </div>
                  )
               }
            </div>
         </aside>
      </main>
   );
}
