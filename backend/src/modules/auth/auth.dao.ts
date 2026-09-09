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
    passwordHash: string;
    phone?: string;
  }): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { updatedAt: new Date(), lastLoginAt: new Date() },
    });
  }

  async createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({ where: { userId, usedAt: null } }),
      prisma.passwordResetToken.create({ data: { userId, tokenHash, expiresAt } }),
    ]);
  }

  async resetPassword(tokenHash: string, password: string): Promise<boolean> {
    return prisma.$transaction(async (transaction) => {
      const token = await transaction.passwordResetToken.findFirst({ where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } } });
      if (!token) return false;
      await transaction.user.update({ where: { id: token.userId }, data: { passwordHash: password } });
      await transaction.passwordResetToken.update({ where: { id: token.id }, data: { usedAt: new Date() } });
      return true;
    });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await prisma.user.update({ where: { id }, data: { passwordHash: password } });
  }
}
