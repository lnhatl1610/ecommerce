import type { User } from "./user.types.js";
import type { CreateUserDTO, UpdateUserDTO } from "./user.dto.js";
import prisma from "../../config/db.js";

export class UserDAO {
  async create(data: CreateUserDTO): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
        role: data.role,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await prisma.user.findMany({
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
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<User | null> {
    try {
      return await prisma.user.delete({
        where: { id },
      });
    } catch {
      return null;
    }
  }
}
