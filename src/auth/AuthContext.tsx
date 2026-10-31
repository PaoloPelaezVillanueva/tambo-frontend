import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { LoginRequest } from "../types/auth";
import type { User } from "../types/user";
import { login as loginService, getMe } from "../services/authService";

interface AuthContextType {
   user: User | null;
   loading: boolean;
   login: (request: LoginRequest) => Promise<void>;
   logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children } : Readonly<{ children: ReactNode }>) {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   const login = useCallback(async (request: LoginRequest) => {
      const response = await loginService(request);

      try {
         const authenticatedUser = await getMe(response.accessToken, response.tokenType);

         sessionStorage.setItem("accessToken", response.accessToken);
         sessionStorage.setItem("tokenType", response.tokenType);

         setUser(authenticatedUser);
      } catch (error) {
         sessionStorage.removeItem("accessToken");
         sessionStorage.removeItem("tokenType");
         throw error;
      }
   }, []);

   const logout = useCallback(() => {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("tokenType");
      setUser(null);
   }, []);


   useEffect(() => {
      const restoreSession = async () => {
         const accessToken = sessionStorage.getItem("accessToken");
         const tokenType = sessionStorage.getItem("tokenType");

         if (!accessToken || !tokenType) {
            setLoading(false);
            return;
         }

         try {
            const authenticatedUser = await getMe(accessToken, tokenType);
            setUser(authenticatedUser);
         } catch {
            logout();
         } finally {
            setLoading(false);
         }
      };

      void restoreSession();
   }, [logout]);

   const value = useMemo(
      () => ({ user, loading, login, logout }),
      [user, loading, login, logout],
   );

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);

   if(!context) {
      throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
   }

   return context;
}