import type { User } from "./auth.types.js";
import prisma from "../../config/db.js";

export class AuthDAO {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
  }
}
