export interface User {
   id: number;
   name: string;
   lastname: string;
   user: string;
   password: string;
   role: Role;
}

export interface Role {
   id: number;
   role: string;
}