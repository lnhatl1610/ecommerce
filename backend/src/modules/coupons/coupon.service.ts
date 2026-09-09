import type { Coupon } from "@prisma/client";
import type { CreateCouponDTO, UpdateCouponDTO } from "./coupon.dto.js";
import { CouponRepository } from "./coupon.repository.js";

export class CouponService {
  constructor(private readonly repository: CouponRepository = new CouponRepository()) {}
  list(): Promise<Coupon[]> { return this.repository.findMany(); }
  async create(data: CreateCouponDTO): Promise<Coupon> {
    if (await this.repository.findByCode(data.code)) throw new Error("Coupon code already exists");
    return this.repository.create(data);
  }
  async update(id: string, data: UpdateCouponDTO): Promise<Coupon> {
    if (data.code) {
      const existing = await this.repository.findByCode(data.code);
      if (existing && existing.id !== id) throw new Error("Coupon code already exists");
    }
    return this.repository.update(id, data);
  }
  delete(id: string): Promise<Coupon> { return this.repository.delete(id); }
}

