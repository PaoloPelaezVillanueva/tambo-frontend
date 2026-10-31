import type { LoginRequest, LoginResponse } from "../types/auth";
import type { User } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL;

export async function login(request: LoginRequest): Promise<LoginResponse> {
   const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
   });

   if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
         throw new Error("Usuario o contraseña incorrectos.");
      }

      throw new Error("No se pudo iniciar sesión. Inténtalo nuevamente.");
   }

   return response.json() as Promise<LoginResponse>;
}

export async function getMe(accessToken: string, tokenType: string): Promise<User> {
   const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
         Authorization: `${tokenType} ${accessToken}`,
      },
   });

   if (!response.ok) {
      throw new Error("No se pudo recuperar el usuario autenticado.");
   }

   return response.json() as Promise<User>;
}