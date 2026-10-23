const API_URL = import.meta.env.VITE_API_URL;

export async function http<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
   const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
         "Content-Type": "application/json",
         ...options.headers,
      },
   });

   if (!response.ok) {
      throw new Error(
         `Error HTTP ${response.status}: ${response.statusText}`
      );
   }

   if (response.status === 204) {
      return undefined as T;
   }

   return response.json() as Promise<T>;
}