import { create } from "zustand";
import { getCategories } from "../services/categoryService";
import { getClients } from "../services/clientService";
import { getProducts } from "../services/productService";

type Categories = Awaited<ReturnType<typeof getCategories>>;
type Products = Awaited<ReturnType<typeof getProducts>>;
type Clients = Awaited<ReturnType<typeof getClients>>;

interface PosState {
   categories: Categories;
   products: Products;
   clients: Clients;

   loadingInitialData: boolean;
   initialized: boolean;
   error: string | null;

   loadInitialData: () => Promise<void>;
   refreshProducts: () => Promise<void>;
   reset: () => void;
}

export const usePosStore = create<PosState>((set, get) => ({
   categories: [],
   products: [],
   clients: [],

   loadingInitialData: false,
   initialized: false,
   error: null,

   loadInitialData: async () => {
      if(get().initialized || get().loadingInitialData) return;

      set({
         loadingInitialData: true,
         error: null
      });

      try {
         const [categoriesData, productsData, clientsData] = await Promise.all([getCategories(), getProducts(), getClients()]);

         set({
            categories: [
               { id: 0, category: 'Todos' },
               ...categoriesData
            ],
            products: productsData,
            clients: clientsData,
            initialized: true
         });
      } catch (error) {
         console.error("Error al cargar los datos iniciales:", error);
         set({ error: "No se pudieron cargar los datos iniciales."});
      } finally {
         set({ loadingInitialData: false });
      }
   },

   refreshProducts: async () => {
      const productsData = await getProducts();
      set({ products: productsData });
   },

   reset: () => {
      set({
         categories: [],
         products: [],
         clients: [],
         loadingInitialData: false,
         initialized: false,
         error: null
      })
   }
}))