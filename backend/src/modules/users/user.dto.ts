import type { Role } from "./user.types.js";

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  phone?: string;
  avatar?: string;
  role?: Role;
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  avatar?: string;
  role?: Role;
  isActive?: boolean;
}