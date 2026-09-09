import type { Role, User as PrismaUser } from "@prisma/client";

export interface User extends PrismaUser {}

export type SafeUser = Omit<User, "passwordHash">;

export interface AuthResponse {
  user: SafeUser;
  accessToken: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}
