import prisma from "../../config/db.js";
import type { Coupon } from "@prisma/client";
import type { CreateCouponDTO, UpdateCouponDTO } from "./coupon.dto.js";

export class CouponDAO {
  findMany(): Promise<Coupon[]> { return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }); }
  findByCode(code: string): Promise<Coupon | null> { return prisma.coupon.findUnique({ where: { code } }); }
  create(data: CreateCouponDTO): Promise<Coupon> { return prisma.coupon.create({ data }); }
  update(id: string, data: UpdateCouponDTO): Promise<Coupon> { return prisma.coupon.update({ where: { id }, data }); }
  delete(id: string): Promise<Coupon> { return prisma.coupon.delete({ where: { id } }); }
}

