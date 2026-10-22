import { useState } from "react";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";

export function useCart() {
   const [items, setItems] = useState<CartItem[]>([]);

   function addItem(product: Product) {
      setItems((currentItems) => {
         const existingItem = currentItems.find((item) => item.product.id === product.id);

         if (existingItem) {
            if (existingItem.quantity >= product.stock) {
               return currentItems;
            }

            return currentItems.map((item) =>
               item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
            );
         }

         if (product.stock <= 0) return currentItems;

         return [...currentItems, { product, quantity: 1 }];
      });
   }

   function decreaseItem(productId: number) {
      setItems((currentItems) =>
         currentItems.map((item) =>
            item.product.id === productId
               ? { ...item, quantity: item.quantity - 1 }
               : item
         ).filter((item) => item.quantity > 0)
      );
   }

   function increaseItem(productId: number) {
      setItems((currentItems) =>
         currentItems.map((item) => {
            if (item.product.id !== productId) return item;

            if (item.quantity >= item.product.stock) return item;

            return { ...item, quantity: item.quantity + 1 };
         })
      );
   }

   function removeItem(productId: number) {
      setItems((currentItems) =>
         currentItems.filter((item) => item.product.id !== productId)
      );
   }

   function clearCart() {
      setItems([]);
   }

   const totalItems = items.reduce((total, item) => total + item.quantity, 0);

   const total = items.reduce((sum, item) => sum + item.product.cost * item.quantity, 0);

   return {
      items,
      totalItems,
      total,
      addItem,
      decreaseItem,
      increaseItem,
      removeItem,
      clearCart,
   };
}
