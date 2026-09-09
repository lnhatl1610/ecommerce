import { CouponDAO } from "./coupon.dao.js";
import type { Coupon } from "@prisma/client";
import type { CreateCouponDTO, UpdateCouponDTO } from "./coupon.dto.js";

export class CouponRepository {
  constructor(private readonly dao: CouponDAO = new CouponDAO()) {}
  findMany(): Promise<Coupon[]> { return this.dao.findMany(); }
  findByCode(code: string): Promise<Coupon | null> { return this.dao.findByCode(code); }
  create(data: CreateCouponDTO): Promise<Coupon> { return this.dao.create(data); }
  update(id: string, data: UpdateCouponDTO): Promise<Coupon> { return this.dao.update(id, data); }
  delete(id: string): Promise<Coupon> { return this.dao.delete(id); }
}

