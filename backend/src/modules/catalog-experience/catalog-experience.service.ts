import { CatalogExperienceRepository } from "./catalog-experience.repository.js";
import type { ReturnStatus } from "@prisma/client";
import type { CreateBrandDTO, CreateBundleDTO, CreateMediaDTO, CreatePromotionDTO, CreateReturnDTO, CreateShippingZoneDTO, InventoryAdjustmentDTO } from "./catalog-experience.dto.js";

export class CatalogExperienceService {
  constructor(private readonly repository = new CatalogExperienceRepository()) {}
  listBrands() { return this.repository.listBrands(); }
  getProductExperience(productId: string) { return this.repository.getProductExperience(productId); }
  recordView(productId: string, userId?: string, sessionId?: string) { return this.repository.recordView(productId, userId, sessionId); }
  listQuestions(productId: string) { return this.repository.listQuestions(productId); }
  createQuestion(userId: string, productId: string, content: string) { return this.repository.createQuestion(userId, productId, content); }
  createAnswer(userId: string, role: string, questionId: string, content: string) { return this.repository.createAnswer(userId, questionId, content, role === "ADMIN" || role === "STAFF"); }
  async shippingQuote(provinceCode: string, subtotal: number) { const quote = await this.repository.shippingQuote(provinceCode, subtotal); return quote ? { available: true, zoneName: quote.zone.name, rates: quote.rates.map(({ id, name, fee, minDays, maxDays }) => ({ id, name, fee, minDays, maxDays })) } : { available: false, rates: [] }; }
  async createReturn(userId: string, data: CreateReturnDTO) { const order = await this.repository.findOwnedOrder(data.orderId, userId); if (!order) throw new Error("Completed order not found"); for (const item of data.items) { const orderItem = order.items.find((candidate) => candidate.id === item.orderItemId); if (!orderItem || item.quantity > orderItem.quantity) throw new Error("Invalid return item quantity"); } return this.repository.createReturn(userId, data); }
  listReturns(userId: string) { return this.repository.listReturns(userId); }
  toggleReviewHelpful(reviewId: string, userId: string) { return this.repository.toggleReviewHelpful(reviewId, userId); }
  createBrand(data: CreateBrandDTO) { return this.repository.createBrand(data); }
  createMedia(data: CreateMediaDTO) { return this.repository.createMedia(data); }
  deleteMedia(id: string) { return this.repository.deleteMedia(id); }
  createPromotion(data: CreatePromotionDTO) { return this.repository.createPromotion(data); }
  createShippingZone(data: CreateShippingZoneDTO) { return this.repository.createShippingZone(data); }
  createBundle(data: CreateBundleDTO) { return this.repository.createBundle(data); }
  adjustInventory(data: InventoryAdjustmentDTO) { return this.repository.adjustInventory(data); }
  updateReturnStatus(id: string, status: ReturnStatus) { return this.repository.updateReturnStatus(id, status); }
}
