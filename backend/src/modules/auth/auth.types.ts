import type { User as PrismaUser } from "@prisma/client";

export interface User extends PrismaUser {}

export interface AuthResponse {
  user: Omit<User, "password">;
  accessToken: string;
  refreshToken: string;
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

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}
