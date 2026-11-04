import { create } from "zustand";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";
import type { Client } from "../types/client";

interface CartState {
   items: CartItem[];
   totalItems: number;
   total: number;

   selectedClient: Client | null;
   setSelectedClient: (client: Client | null) => void;

   addItem: (product: Product) => void;
   decreaseItem: (productId: number) => void;
   increaseItem: (productId: number) => void;
   removeItem: (productId: number) => void;
   clearCart: () => void;
   reset: () => void;
}

function calculateCart(items: CartItem[]) {
   return {
      items,
      totalItems: items.reduce((accumulator, item) => accumulator + item.quantity, 0),
      total: items.reduce((accumulator, item) => accumulator + item.product.cost * item.quantity, 0)
   }
}

export const useCartStore = create<CartState>((set) => ({
   items: [],
   totalItems: 0,
   total: 0,

   selectedClient: null,
   setSelectedClient: (client) => set({ selectedClient: client }),

   addItem: (product) => {
      set((state) => {
         if (product.stock <= 0) return state;

         const existingItem = state.items.find(
            (item) => item.product.id === product.id,
         );

         if (existingItem && existingItem.quantity >= product.stock) {
            return state;
         }

         const updatedItems = existingItem
            ? state.items.map((item) =>
               item.product.id === product.id
                  ? {
                        ...item,
                        product,
                        quantity: item.quantity + 1,
                     }
                  : item,
            ) : [...state.items, { product, quantity: 1 }];

         return calculateCart(updatedItems);
      });
   },

   decreaseItem: (productId) => {
      set((state) => {
         const updatedItems = state.items
            .map((item) =>
               item.product.id === productId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item,
            )
            .filter((item) => item.quantity > 0);

         return calculateCart(updatedItems);
      });
   },

   increaseItem: (productId) => {
      set((state) => {
         const updatedItems = state.items.map((item) =>
            item.product.id === productId && item.quantity < item.product.stock
               ? { ...item, quantity: item.quantity + 1 }
               : item,
         );

         return calculateCart(updatedItems);
      });
   },

   removeItem: (productId) => {
      set((state) => {
         const updatedItems = state.items.filter((item) => item.product.id !== productId);

         return calculateCart(updatedItems);
      });
   },

   clearCart: () => set(calculateCart([])),

   reset: () => set(calculateCart([])),
}));