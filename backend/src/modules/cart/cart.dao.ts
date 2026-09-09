import prisma from "../../config/db.js";
import type { AddCartItemDTO, UpdateCartItemDTO } from "./cart.dto.js";
import type { CartOwner, CartWithItems } from "./cart.types.js";

const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, thumbnail: true },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
};

export class CartDAO {
  async find(owner: CartOwner): Promise<CartWithItems | null> {
    return prisma.cart.findFirst({ where: owner, include: cartInclude });
  }

  async create(owner: CartOwner): Promise<CartWithItems> {
    return prisma.cart.create({ data: owner, include: cartInclude });
  }

  async upsertItem(cartId: string, data: AddCartItemDTO): Promise<CartWithItems> {
    await prisma.cartItem.upsert({
      where: { cartId_variantId: { cartId, variantId: data.variantId } },
      create: { cartId, variantId: data.variantId, quantity: data.quantity },
      update: { quantity: { increment: data.quantity } },
    });
    return prisma.cart.findUniqueOrThrow({ where: { id: cartId }, include: cartInclude });
  }

  async updateItem(cartId: string, itemId: string, data: UpdateCartItemDTO): Promise<CartWithItems | null> {
    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId } });
    if (!item) return null;
    await prisma.cartItem.update({ where: { id: itemId }, data });
    return prisma.cart.findUnique({ where: { id: cartId }, include: cartInclude });
  }

  async removeItem(cartId: string, itemId: string): Promise<CartWithItems | null> {
    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId } });
    if (!item) return null;
    await prisma.cartItem.delete({ where: { id: itemId } });
    return prisma.cart.findUnique({ where: { id: cartId }, include: cartInclude });
  }

  async merge(sourceCartId: string, targetCartId: string): Promise<CartWithItems> {
    return prisma.$transaction(async (transaction) => {
      const source = await transaction.cart.findUnique({ where: { id: sourceCartId }, include: { items: true } });
      if (source) {
        for (const item of source.items) {
          await transaction.cartItem.upsert({
            where: { cartId_variantId: { cartId: targetCartId, variantId: item.variantId } },
            create: { cartId: targetCartId, variantId: item.variantId, quantity: item.quantity },
            update: { quantity: { increment: item.quantity } },
          });
        }
        await transaction.cart.delete({ where: { id: sourceCartId } });
      }
      return transaction.cart.findUniqueOrThrow({ where: { id: targetCartId }, include: cartInclude });
    });
  }
}
