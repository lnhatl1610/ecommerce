import prisma from "../../config/db.js";
export class WishlistDAO {
  list(userId: string) { return prisma.wishlist.findMany({ where: { userId }, include: { product: { include: { variants: true, images: { orderBy: { order: "asc" } } } } }, orderBy: { createdAt: "desc" } }); }
  add(userId: string, productId: string) { return prisma.wishlist.upsert({ where: { userId_productId: { userId, productId } }, create: { userId, productId }, update: {}, include: { product: true } }); }
  remove(userId: string, productId: string) { return prisma.wishlist.deleteMany({ where: { userId, productId } }); }
}
