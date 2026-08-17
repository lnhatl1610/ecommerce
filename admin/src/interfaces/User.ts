
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    role: "user" | "admin";
    age?: number;
    phone?: string;
    address?: string;
}