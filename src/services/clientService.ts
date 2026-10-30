import { http } from "../api/http"
import type { Client } from "../types/client"

export const getClients = () => {
   return http<Client[]>('/clients');
}