export type Role = "CUSTOMER" | "ADMIN" | "STAFF";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type AuthProvider = "LOCAL" | "GOOGLE" | "FACEBOOK";

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    logoUrl?: string | null;
    role: Role;
    isActive: boolean;
    status: UserStatus;
    gender?: Gender | null;
    dateOfBirth?: string | null;
    emailVerifiedAt?: string | null;
    phoneVerifiedAt?: string | null;
    provider?: AuthProvider;
    providerId?: string | null;
    lastLoginAt?: string | null;
    deletedAt?: string | null;
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
    logoUrl?: string;
    avatar?: string;
    provider?: AuthProvider;
    providerId?: string;
    emailVerifiedAt?: string | null;
    phoneVerifiedAt?: string | null;
    status?: UserStatus;
    gender?: Gender;
    dateOfBirth?: string;
}
