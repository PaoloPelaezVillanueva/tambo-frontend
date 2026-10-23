import type { Category } from "./category";

export interface Product {
   id: number;
   name: string;
   description: string;
   cost: number;
   stock: number;
   active: boolean;
   category: Category;
};