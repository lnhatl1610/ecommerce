export type Role = "CUSTOMER" | "ADMIN" | "STAFF";

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    role: Role;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUser {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: Role;
}

export interface UpdateUser extends Partial<CreateUser> {
    id: string;
    isActive?: boolean;
}
