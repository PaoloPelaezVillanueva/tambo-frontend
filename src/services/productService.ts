import { http } from "../api/http"
import type { Product } from "../types/product";

export const getProducts = () => {
   return http<Product[]>('/products');
}