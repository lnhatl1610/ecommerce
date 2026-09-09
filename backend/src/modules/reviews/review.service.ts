import type { Review } from "@prisma/client";
import type { CreateReviewDTO, UpdateReviewDTO } from "./review.dto.js";
import { ReviewRepository } from "./review.repository.js";
import type { ReviewWithUser } from "./review.types.js";
export class ReviewService {
  constructor(private readonly repository: ReviewRepository = new ReviewRepository()) {}
  list(productId: string): Promise<ReviewWithUser[]> { return this.repository.list(productId); }
  listAll(): Promise<ReviewWithUser[]> { return this.repository.listAll(); }
  async create(userId: string, data: CreateReviewDTO): Promise<Review> { if (!(await this.repository.hasPurchased(userId, data.productId))) throw new Error("Only verified buyers can review this product"); return this.repository.create(userId, data); }
  update(id: string, userId: string, data: UpdateReviewDTO): Promise<Review | null> { return this.repository.update(id, userId, data); }
  delete(id: string, userId?: string): Promise<Review | null> { return this.repository.delete(id, userId); }
}
