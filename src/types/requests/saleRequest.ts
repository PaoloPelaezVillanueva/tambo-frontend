export interface SaleRequest {
   client: number | null;
   user: number;
   details: SaleDetailRequest[]
};

export interface SaleDetailRequest {
   product: number;
   quantity: number;
};