import type { User } from "./user.types.js";
import type { CreateUserDTO, UpdateUserDTO } from "./user.dto.js";
import prisma from "../../config/db.js";

export class UserDAO {
  async create(data: CreateUserDTO): Promise<User> {
    const { password, ...profile } = data;
    return await prisma.user.create({
      data: {
        ...profile,
        passwordHash: password,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: UpdateUserDTO): Promise<User | null> {
    try {
      const { password, ...profile } = data;
      return await prisma.user.update({
        where: { id },
        data: { ...profile, ...(password ? { passwordHash: password } : {}) },
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<User | null> {
    try {
      return await prisma.user.update({
        where: { id },
        data: { deletedAt: new Date(), status: "INACTIVE", isActive: false },
      });
    } catch {
      return null;
    }
  }
}
