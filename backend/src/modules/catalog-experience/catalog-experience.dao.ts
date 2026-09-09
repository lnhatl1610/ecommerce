import prisma from "../../config/db.js";
import type { ReturnStatus } from "@prisma/client";
import type { CreateBrandDTO, CreateBundleDTO, CreateMediaDTO, CreatePromotionDTO, CreateReturnDTO, CreateShippingZoneDTO, InventoryAdjustmentDTO } from "./catalog-experience.dto.js";

export class CatalogExperienceDAO {
  listBrands() { return prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }); }
  async getProductExperience(productId: string) {
    const now = new Date();
    const product = await prisma.product.findUnique({ where: { id: productId }, select: { categoryId: true, brand: true, media: { orderBy: { position: "asc" } } } });
    if (!product) return null;
    const [promotions, bundles, soldCount, viewCount] = await Promise.all([
      prisma.promotion.findMany({ where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now }, OR: [{ products: { some: { productId } } }, { categories: { some: { categoryId: product.categoryId } } }] }, orderBy: { priority: "desc" } }),
      prisma.productBundle.findMany({ where: { isActive: true, items: { some: { productId } } }, include: { items: { where: { productId }, include: { componentProduct: { include: { variants: true, media: { orderBy: { position: "asc" } } } } } } } }),
      prisma.orderItem.aggregate({ where: { variant: { productId }, order: { status: "COMPLETED" } }, _sum: { quantity: true } }),
      prisma.productViewEvent.count({ where: { productId } }),
    ]);
    return { brand: product.brand, media: product.media, promotions, bundles, soldCount: soldCount._sum.quantity ?? 0, viewCount };
  }
  recordView(productId: string, userId?: string, sessionId?: string) { return prisma.productViewEvent.create({ data: { productId, userId, sessionId } }); }
  listQuestions(productId: string) { return prisma.productQuestion.findMany({ where: { productId, status: { not: "HIDDEN" } }, include: { user: { select: { id: true, name: true, avatar: true } }, answers: { include: { user: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: "asc" } } }, orderBy: { createdAt: "desc" } }); }
  createQuestion(userId: string, productId: string, content: string) { return prisma.productQuestion.create({ data: { userId, productId, content } }); }
  async createAnswer(userId: string, questionId: string, content: string, isOfficial: boolean) { return prisma.$transaction(async (tx) => { const answer = await tx.productAnswer.create({ data: { userId, questionId, content, isOfficial } }); await tx.productQuestion.update({ where: { id: questionId }, data: { status: "ANSWERED" } }); return answer; }); }
  async shippingQuote(provinceCode: string, subtotal: number) { const province = await prisma.shippingZoneProvince.findUnique({ where: { provinceCode }, include: { zone: { include: { rates: { where: { isActive: true }, orderBy: { fee: "asc" } } } } } }); if (!province?.zone.isActive) return null; return { zone: province.zone, rates: province.zone.rates.map((rate) => ({ ...rate, fee: rate.freeFrom !== null && subtotal >= rate.freeFrom ? 0 : rate.fee })) }; }
  findOwnedOrder(orderId: string, userId: string) { return prisma.order.findFirst({ where: { id: orderId, userId, status: "COMPLETED" }, include: { items: true } }); }
  createReturn(userId: string, data: CreateReturnDTO) { return prisma.returnRequest.create({ data: { userId, orderId: data.orderId, reason: data.reason, items: { create: data.items } }, include: { items: { include: { orderItem: true } }, order: true } }); }
  listReturns(userId: string) { return prisma.returnRequest.findMany({ where: { userId }, include: { items: { include: { orderItem: true } }, order: true }, orderBy: { createdAt: "desc" } }); }
  async toggleReviewHelpful(reviewId: string, userId: string) { const key = { reviewId_userId: { reviewId, userId } }; const existing = await prisma.reviewHelpful.findUnique({ where: key }); if (existing) { await prisma.reviewHelpful.delete({ where: key }); return { helpful: false }; } await prisma.reviewHelpful.create({ data: { reviewId, userId } }); return { helpful: true }; }
  createBrand(data: CreateBrandDTO) { return prisma.brand.create({ data }); }
  createMedia(data: CreateMediaDTO) { return prisma.productMedia.create({ data: { ...data, position: data.position ?? 0 } }); }
  deleteMedia(id: string) { return prisma.productMedia.delete({ where: { id } }); }
  createPromotion(data: CreatePromotionDTO) { return prisma.promotion.create({ data: { name: data.name, discountType: data.discountType, discountValue: data.discountValue, startsAt: new Date(data.startsAt), endsAt: new Date(data.endsAt), priority: data.priority ?? 0, products: data.productIds?.length ? { create: data.productIds.map((productId) => ({ productId })) } : undefined, categories: data.categoryIds?.length ? { create: data.categoryIds.map((categoryId) => ({ categoryId })) } : undefined }, include: { products: true, categories: true } }); }
  createShippingZone(data: CreateShippingZoneDTO) { return prisma.shippingZone.create({ data: { name: data.name, provinces: { create: data.provinces }, rates: { create: data.rates } }, include: { provinces: true, rates: true } }); }
  createBundle(data: CreateBundleDTO) { return prisma.productBundle.create({ data: { name: data.name, discountType: data.discountType, discountValue: data.discountValue, items: { create: data.items.map((item) => ({ productId: data.productId, componentProductId: item.componentProductId, quantity: item.quantity ?? 1 })) } }, include: { items: true } }); }
  adjustInventory(data: InventoryAdjustmentDTO) { return prisma.$transaction(async (tx) => { const updated = await tx.productVariant.update({ where: { id: data.variantId }, data: { stockQuantity: { increment: data.quantity } } }); if (updated.stockQuantity < 0) throw new Error("Inventory cannot be negative"); await tx.inventoryTransaction.create({ data: { variantId: data.variantId, type: "ADJUSTMENT", quantity: data.quantity, note: data.note } }); return updated; }); }
  updateReturnStatus(id: string, status: ReturnStatus) { return prisma.$transaction(async (tx) => { const request = await tx.returnRequest.findUniqueOrThrow({ where: { id }, include: { items: { include: { orderItem: true } } } }); if (status === "RECEIVED" && request.status !== "RECEIVED" && request.status !== "REFUNDED") { for (const item of request.items) { await tx.productVariant.update({ where: { id: item.orderItem.variantId }, data: { stockQuantity: { increment: item.quantity } } }); await tx.inventoryTransaction.create({ data: { variantId: item.orderItem.variantId, type: "RETURN", quantity: item.quantity, referenceId: request.id, note: "Return received" } }); } } return tx.returnRequest.update({ where: { id }, data: { status }, include: { items: true } }); }); }
}
