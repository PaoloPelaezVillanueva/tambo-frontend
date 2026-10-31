export interface User {
   id: number;
   name: string;
   lastname: string;
   user: string;
   role: Role;
}

export interface Role {
   id: number;
   role: string;
}