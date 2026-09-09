import type { Address } from "./address.types.js";
import type { CreateAddressDTO, UpdateAddressDTO } from "./address.dto.js";
import prisma from "../../config/db.js";

export class AddressDAO {
  async findByUserId(userId: string): Promise<Address[]> {
    return await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }

  async findById(id: string): Promise<Address | null> {
    return await prisma.address.findUnique({ where: { id } });
  }

  async create(userId: string, data: CreateAddressDTO): Promise<Address> {
    return await prisma.address.create({
      data: {
        userId,
        recipientName: data.recipientName,
        phone: data.phone,
        province: data.province,
        district: data.district,
        ward: data.ward,
        detail: data.detail,
        isDefault: data.isDefault ?? false,
      },
    });
  }

  async update(id: string, data: UpdateAddressDTO): Promise<Address | null> {
    try {
      return await prisma.address.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<Address | null> {
    try {
      return await prisma.address.delete({ where: { id } });
    } catch {
      return null;
    }
  }

  async unsetDefaultForUser(userId: string): Promise<void> {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  async setDefault(userId: string, id: string): Promise<Address | null> {
    return prisma.$transaction(async (transaction) => {
      const address = await transaction.address.findFirst({ where: { id, userId } });
      if (!address) return null;
      await transaction.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
      return transaction.address.update({ where: { id }, data: { isDefault: true } });
    });
  }
}
