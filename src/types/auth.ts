export interface LoginRequest {
   user: string;
   password: string;
}

export interface LoginResponse {
   accessToken: string;
   tokenType: string;
   expiresIn: number;
}

export interface ChangePasswordRequest {
   currentPassword: string;
   newPassword: string;
   confirmPassword: string;
}