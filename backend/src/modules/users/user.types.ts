import type { User as PrismaUser, Role } from "@prisma/client";

export type { Role };

export interface User extends PrismaUser { }

export type SafeUser = Omit<User, "password">;