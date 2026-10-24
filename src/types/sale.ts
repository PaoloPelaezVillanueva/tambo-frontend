import type { Client } from "./client";
import type { Product } from "./product";
import type { User } from "./user";

export interface Sale {
   id: number;
   client: Client | null;
   date: string;
   user: User;
   total: number;
   details: SaleDetail[];
};

export interface SaleDetail {
   id: number;
   product: Product,
   quantity: number,
   subtotal: number
};