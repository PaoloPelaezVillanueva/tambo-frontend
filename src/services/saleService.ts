import { http } from "../api/http";
import type { SaleRequest } from "../types/requests/saleRequest";

export function createSale(request: SaleRequest) {
   return http<unknown>("/sales", {
      method: 'POST',
      body: JSON.stringify(request)
   });
};