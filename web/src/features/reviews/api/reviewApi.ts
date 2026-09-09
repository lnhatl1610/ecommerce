import { apiClient } from "@/lib/apiClient";
import type { ApiEnvelope } from "@/types/api";

export interface ReviewRecord {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  helpfulCount?: number;
  verifiedPurchase?: boolean;
  images?: string[];
  user: { id: string; name: string; avatar?: string | null };
}
interface ReviewApiRecord extends ReviewRecord { media?: Array<{ url: string }>; _count?: { helpful: number } }
interface ReviewApiRecord extends ReviewRecord { media?: Array<{ url: string }>; _count?: { helpful: number } }
export interface CreateReviewPayload { productId: string; rating: number; comment?: string }
export const reviewApi = {
  list: async (productId: string) => (await apiClient.get<ApiEnvelope<ReviewApiRecord[]>>(`/reviews/product/${productId}`)).data.data.map((review) => ({ ...review, images: review.media?.map((media) => media.url) ?? review.images, helpfulCount: review._count?.helpful ?? review.helpfulCount })),
  create: async (payload: CreateReviewPayload) => (await apiClient.post<ApiEnvelope<ReviewRecord>>("/reviews", payload)).data.data,
  toggleHelpful: async (reviewId: string) => (await apiClient.post<ApiEnvelope<{ helpful: boolean }>>(`/experience/reviews/${reviewId}/helpful`)).data.data,
};
