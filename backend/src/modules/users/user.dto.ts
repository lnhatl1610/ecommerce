import type { Gender, Role, UserStatus, AuthProvider } from "@prisma/client";

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  phone?: string;
  avatar?: string;
  logoUrl?: string;
  role?: Role;
  gender?: Gender;
  dateOfBirth?: Date;
  status?: UserStatus;
  provider?: AuthProvider;
  providerId?: string;
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  avatar?: string;
  logoUrl?: string;
  role?: Role;
  isActive?: boolean;
  gender?: Gender;
  dateOfBirth?: Date;
  status?: UserStatus;
  emailVerifiedAt?: Date | null;
  phoneVerifiedAt?: Date | null;
  provider?: AuthProvider;
  providerId?: string;
  deletedAt?: Date | null;
}
