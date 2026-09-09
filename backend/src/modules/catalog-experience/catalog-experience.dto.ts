export interface CreateQuestionDTO { productId: string; content: string }
export interface CreateAnswerDTO { content: string }
export interface RecordProductViewDTO { sessionId?: string }
export interface CreateReturnDTO { orderId: string; reason: string; items: Array<{ orderItemId: string; quantity: number; condition?: string }> }
export interface CreateBrandDTO { name: string; slug: string; logoUrl?: string }
export interface CreateMediaDTO { productId: string; variantId?: string; type: "IMAGE" | "VIDEO"; url: string; altText?: string; position?: number }
export interface CreatePromotionDTO { name: string; discountType: "PERCENTAGE" | "FIXED"; discountValue: number; startsAt: string; endsAt: string; priority?: number; productIds?: string[]; categoryIds?: string[] }
export interface CreateShippingZoneDTO { name: string; provinces: Array<{ provinceCode: string; provinceName: string }>; rates: Array<{ name: string; fee: number; freeFrom?: number; minDays: number; maxDays: number }> }
export interface CreateBundleDTO { name: string; productId: string; items: Array<{ componentProductId: string; quantity?: number }>; discountType?: "PERCENTAGE" | "FIXED"; discountValue?: number }
export interface InventoryAdjustmentDTO { variantId: string; quantity: number; note?: string }
