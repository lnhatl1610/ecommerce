
export interface User {
    id: string;
    name: string;
    email: string;
    age?: number;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    role: "user" | "admin";
    phone?: string;
    address?: string;
}