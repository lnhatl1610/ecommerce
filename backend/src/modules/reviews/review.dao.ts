import prisma from "../../config/db.js";
import type { Review } from "@prisma/client";
import type { CreateReviewDTO, UpdateReviewDTO } from "./review.dto.js";
import type { ReviewWithUser } from "./review.types.js";
export class ReviewDAO {
  list(productId: string): Promise<ReviewWithUser[]> { return prisma.review.findMany({ where: { productId }, include: { user: { select: { id: true, name: true, avatar: true } }, media: { orderBy: { position: "asc" } }, _count: { select: { helpful: true } } }, orderBy: { createdAt: "desc" } }); }
  listAll(): Promise<ReviewWithUser[]> { return prisma.review.findMany({ include: { user: { select: { id: true, name: true, avatar: true } }, product: { select: { id: true, name: true } }, media: { orderBy: { position: "asc" } }, _count: { select: { helpful: true } } }, orderBy: { createdAt: "desc" } }); }
  hasPurchased(userId: string, productId: string): Promise<number> { return prisma.orderItem.count({ where: { order: { userId, status: "COMPLETED" }, variant: { productId } } }); }
  create(userId: string, data: CreateReviewDTO): Promise<Review> { return prisma.review.create({ data: { userId, ...data } }); }
  update(id: string, userId: string, data: UpdateReviewDTO): Promise<Review | null> { return prisma.review.findFirst({ where: { id, userId } }).then((review) => review ? prisma.review.update({ where: { id }, data }) : null); }
  delete(id: string, userId?: string): Promise<Review | null> { return prisma.review.findFirst({ where: { id, ...(userId ? { userId } : {}) } }).then((review) => review ? prisma.review.delete({ where: { id } }) : null); }
}
