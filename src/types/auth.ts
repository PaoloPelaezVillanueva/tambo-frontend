export interface LoginRequest {
   user: string;
   password: string;
}

export interface LoginResponse {
   accessToken: string;
   tokenType: string;
   expiresIn: number;
}