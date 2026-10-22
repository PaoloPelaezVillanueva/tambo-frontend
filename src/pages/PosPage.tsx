import { useMemo, useState } from "react";
import {
   House,
   Package,
   ReceiptText,
   Settings,
   Search,
   Plus,
   Minus,
   Trash2,
   ShoppingCart,
   Store,
   CreditCard,
   X
} from "lucide-react";
import Logo from "../assets/logo.png";
import { products } from "../data/products";
import { useCart } from "../hooks/useCart";
import type { Client } from "../types/client";
import { clients } from "../data/clients";

const formatCurrency = (amount: number) =>
   new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
   }).format(amount);

const productEmojis: Record<number, string> = {
   1: "🌾",
   2: "🥛",
   3: "🥤",
   4: "🍞",
   5: "🫗",
   6: "🥚",
   7: "🍪",
   8: "💧",
};

export default function PosVenta() {
   const [search, setSearch] = useState("");
   const [category, setCategory] = useState("Todos");

   const [clientSearch, setClientSearch] = useState("");
   const [selectedClient, setSelectedClient] = useState<Client | null>(null);
   const [showClientDropdown, setShowClientDropdown] = useState(false);

   const {
      items,
      totalItems,
      total,
      addItem,
      decreaseItem,
      increaseItem,
      removeItem,
      clearCart,
   } = useCart();

   const categories = ["Todos", ...new Set(products.map((product) => product.category))];

   const filteredProducts = useMemo(() => {
      return products.filter((product) => {
         const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())

         const matchesCategory = category === "Todos" || product.category === category;

         return matchesSearch && matchesCategory;
      });
   }, [search, category]);

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
   }, [clientSearch]);

   function handlePayment() {
      if (items.length === 0) {
         alert("Agrega productos antes de cobrar.");
         return;
      }

      alert(`Venta de ${formatCurrency(total)} lista para procesar.`);
   }

   return (
      <div className="flex h-screen min-h-[600px] overflow-hidden bg-slate-100 text-slate-800">
         {/* Barra lateral */}
         <aside className="flex w-[68px] shrink-0 flex-col items-center border-r border-slate-200 bg-white py-5">
            <div className="mb-10 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
               <Store size={22} />
            </div>

            <nav className="flex flex-1 flex-col gap-4">
               <button title="Inicio" className="cursor-pointer rounded-xl bg-purple-50 p-3 text-purple-600">
                  <House size={21} />
               </button>

               <button title="Productos" className="cursor-pointer rounded-xl p-3 text-slate-500 hover:bg-slate-100">
                  <Package size={21} />
               </button>

               <button title="Ventas" className="cursor-pointer rounded-xl p-3 text-slate-500 hover:bg-slate-100">
                  <ReceiptText size={21} />
               </button>
            </nav>

            <button title="Configuración" className="cursor-pointer rounded-xl p-3 text-slate-500 hover:bg-slate-100">
               <Settings size={21} />
            </button>
         </aside>

         {/* Catálogo */}
         <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
               <div>
                  <img src={Logo} alt="Logo tambo" className="h-12 object-contain" />
                  <p className="text-sm text-slate-500">Punto de venta</p>
               </div>

               <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium">Marcos Gomez</p>
                  <p className="text-xs text-slate-500">Colaborador</p>
               </div>
            </header>

            <section className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-5 sm:p-6">
               <div>
                  <h1 className="text-xl font-bold">Nueva venta</h1>
                  <p className="mt-1 text-sm text-slate-500">
                     Busca y selecciona los productos.
                  </p>
               </div>

               {/* Búsqueda */}
               <div className="relative">
                  <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input
                     value={search}
                     onChange={(event) => setSearch(event.target.value)}
                     placeholder="Buscar producto o código..."
                     className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
               </div>

               {/* Categorías */}
               <div className="flex gap-2 pb-1">
                  {categories.map((item) => (
                     <button
                        key={item}
                        onClick={() => setCategory(item)}
                        className={`cursor-pointer shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                           category === item
                              ? "bg-purple-600 text-white"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                     >
                        {item}
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
                           disabled={outOfStock}
                           className="cursor-pointer group flex min-h-[190px] flex-col rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-purple-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                        >
                           <div className="mb-3 flex h-24 w-full items-center justify-center rounded-lg bg-slate-50 text-5xl">
                              {productEmojis[product.id] ?? "📦"}
                           </div>

                           <h2 className="mt-1 line-clamp-2 text-md font-semibold mb-2">
                              {product.name}
                           </h2>

                           <div>
                              <span className="rounded-lg text-[12px] bg-purple-50 p-1.5 text-purple-600">
                                 {product.category}
                              </span>
                           </div>


                           <h3 className="text-gray-500 pt-3 text-sm">
                              {product.description}
                           </h3>

                           <div className="mt-auto flex w-full items-center justify-between gap-2 pt-3">
                              <span className="font-bold text-purple-600">
                                 {formatCurrency(product.cost)}
                              </span>

                              <span className="text-[12px] text-slate-500">
                                 Stock: {product.stock}
                              </span>
                           </div>
                        </button>
                     );
                  })}
               </div>

               {filteredProducts.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                     <Package className="mx-auto mb-3 text-slate-400" size={32} />
                     <p className="font-medium">No se encontraron productos</p>
                     <p className="mt-1 text-sm text-slate-500">Prueba con otro nombre o categoría.</p>
                  </div>
               )}
            </section>
         </main>

         {/* Carrito */}
         <aside className="flex w-[340px] shrink-0 flex-col border-l border-slate-200 bg-white xl:w-[390px]">
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
               <div>
                  <h2 className="text-lg font-bold">Venta actual</h2>
                  <p className="mt-1 text-xs text-slate-500">Pedido #0001 · {totalItems} unidades</p>
               </div>

               <button
                  onClick={clearCart}
                  disabled={items.length === 0}
                  className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-40"
               >
                  Limpiar
               </button>
            </header>

            {/* Lista de productos del carrito */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
               {items.length === 0 ? (
                  <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
                     <div className="mb-3 rounded-full bg-slate-100 p-4">
                        <ShoppingCart size={28} className="text-slate-400" />
                     </div>

                     <p className="font-semibold">Carrito vacío</p>
                     <p className="mt-1 text-sm text-slate-500">Selecciona productos del catálogo.</p>
                  </div>
               ) : (
                  items.map((item) => (
                     <div key={item.product.id} className="flex gap-3 border-b border-slate-100 pb-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-2xl">
                           {productEmojis[item.product.id] ?? "📦"}
                        </div>

                        <div className="min-w-0 flex-1">
                           <h3 className="line-clamp-2 text-sm font-semibold">
                              {item.product.name}
                           </h3>

                           <p className="mt-1 text-xs text-slate-500">
                              {formatCurrency(item.product.cost)}
                           </p>

                           <div className="mt-3 flex items-center gap-2">
                              <button
                                 onClick={() => decreaseItem(item.product.id)}
                                 aria-label={`Disminuir ${item.product.name}`}
                                 className="cursor-pointer rounded-md border border-slate-200 p-1 hover:bg-slate-50"
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
                                 className="cursor-pointer rounded-md border border-slate-200 p-1 hover:bg-slate-50 disabled:opacity-40"
                              >
                                 <Plus size={14} />
                              </button>

                              <button
                                 onClick={() => removeItem(item.product.id)}
                                 aria-label={`Eliminar ${item.product.name}`}
                                 className="cursor-pointer ml-auto rounded-md p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                              >
                                 <Trash2 size={17} />
                              </button>
                           </div>
                        </div>

                        <p className="shrink-0 text-sm font-bold">
                           {formatCurrency(item.product.cost * item.quantity)}
                        </p>
                     </div>
                  ))
               )}
            </div>

            {/* Cliente */}
            <div className="relative border-t border-slate-200 p-5">
               <label className="mb-3 block text-sm font-semibold">Cliente:</label>
               {
                  selectedClient ? (
                     <div className="flex items-center justify-between gap-3 rounded-xl border border-purple-200 bg-purple-50 p-3">
                        <div className="min-w-0">
                           <p className="truncate text-sm font-semibold text-slate-800">
                              {selectedClient.name} {selectedClient.lastname}
                           </p>

                           <p className="mt-1 text-xs text-slate-500">
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
                           className="cursor-pointer shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-red-100 hover:text-red-600"
                        >
                           <X size={18} />
                        </button>
                     </div>
                  ) : (
                     <div className="relative">
                        <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input
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
                           className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                        />

                        {
                           showClientDropdown && clientSearch.trim() !== "" && (
                              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                 {
                                    filteredClients.length > 0 ? (
                                       filteredClients.map((client) => (
                                          <button
                                             key={client.id}
                                             type="button"
                                             onClick={() => {
                                                setSelectedClient(client);
                                                setClientSearch("");
                                                setShowClientDropdown(false);
                                             }}
                                             className="cursor-pointer flex w-full flex-col gap-1 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-purple-50"
                                          >
                                             <span className="text-sm font-medium text-slate-800">{client.name} {client.lastname}</span>
                                             <span className="text-xs text-slate-500">DNI: {client.dni}</span>
                                          </button>
                                       ))
                                    ) : (
                                       <p className="px-4 py-3 text-sm text-slate-500 text-center">
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
            <div className="space-y-4 border-t border-slate-200 p-5">
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">{formatCurrency(total)}</span>
               </div>

               <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="font-semibold">Total a pagar</span>
                  <span className="text-xl font-bold text-purple-600">
                     {formatCurrency(total)}
                  </span>
               </div>

               <button
                  onClick={handlePayment}
                  disabled={items.length === 0}
                  className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-slate-300"
               >
                  <CreditCard size={19} />
                  Procesar venta
               </button>
            </div>
         </aside>
      </div>
   );
}
