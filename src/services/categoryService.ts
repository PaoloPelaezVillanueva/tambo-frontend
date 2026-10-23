import { http } from "../api/http"
import type { Category } from "../types/category";

export const getCategories = () => {
   return http<Category[]>('/categories');
}