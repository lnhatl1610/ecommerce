import type { ProductMediaType, Review } from "@prisma/client";
export type { Review };
export interface ReviewWithUser extends Review {
  user: { id: string; name: string; avatar: string | null };
  media: Array<{ id: string; type: ProductMediaType; url: string; position: number; createdAt: Date; reviewId: string }>;
  _count: { helpful: number };
  product?: { id: string; name: string };
}
