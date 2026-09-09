import type { Prisma } from "@prisma/client";

export type ProductQuestionWithAnswers = Prisma.ProductQuestionGetPayload<{ include: { user: { select: { id: true; name: true; avatar: true } }; answers: { include: { user: { select: { id: true; name: true; avatar: true } } } } } }>;
export type ReturnRequestWithItems = Prisma.ReturnRequestGetPayload<{ include: { items: { include: { orderItem: true } }; order: true } }>;

export interface ShippingQuote {
  available: boolean;
  zoneName?: string;
  rates: Array<{ id: string; name: string; fee: number; minDays: number; maxDays: number }>;
}
