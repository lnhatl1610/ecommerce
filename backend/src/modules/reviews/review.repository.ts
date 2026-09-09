import { ReviewDAO } from "./review.dao.js";
import type { Review } from "@prisma/client";
import type { CreateReviewDTO, UpdateReviewDTO } from "./review.dto.js";
import type { ReviewWithUser } from "./review.types.js";
export class ReviewRepository {
  constructor(private readonly dao: ReviewDAO = new ReviewDAO()) {}
  list(productId: string): Promise<ReviewWithUser[]> { return this.dao.list(productId); }
  listAll(): Promise<ReviewWithUser[]> { return this.dao.listAll(); }
  hasPurchased(userId: string, productId: string): Promise<number> { return this.dao.hasPurchased(userId, productId); }
  create(userId: string, data: CreateReviewDTO): Promise<Review> { return this.dao.create(userId, data); }
  update(id: string, userId: string, data: UpdateReviewDTO): Promise<Review | null> { return this.dao.update(id, userId, data); }
  delete(id: string, userId?: string): Promise<Review | null> { return this.dao.delete(id, userId); }
}
