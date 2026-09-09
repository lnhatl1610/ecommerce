import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import app from "../src/app.js";
import { OrderService } from "../src/modules/orders/order.service.js";

const prisma = new PrismaClient();
const createdUserIds: string[] = [];
const createdProductIds: string[] = [];
const createdCategoryIds: string[] = [];

describe("API security", () => {
  it("exposes health without authentication", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("protects order history", async () => {
    const response = await request(app).get("/api/orders");
    expect(response.status).toBe(401);
  });
});

describe("checkout inventory concurrency", () => {
  it("allows only one buyer to claim the last unit", async () => {
    const suffix = randomUUID();
    const category = await prisma.category.create({ data: { name: `Race ${suffix}`, slug: `race-${suffix}` } });
    createdCategoryIds.push(category.id);
    const product = await prisma.product.create({ data: { name: "Race product", slug: `race-product-${suffix}`, description: "Race fixture", categoryId: category.id, basePrice: 100, status: "ACTIVE", variants: { create: { sku: `RACE-${suffix}`, price: 100, stockQuantity: 1 } } }, include: { variants: true } });
    createdProductIds.push(product.id);
    const password = await bcrypt.hash("Password123!", 4);
    const users = await Promise.all([1, 2].map((index) => prisma.user.create({ data: { name: `Buyer ${index}`, email: `race-${index}-${suffix}@example.com`, password, cart: { create: { items: { create: { variantId: product.variants[0].id, quantity: 1 } } } } } })));
    createdUserIds.push(...users.map((user) => user.id));
    const results = await Promise.allSettled(users.map((user) => new OrderService().checkout(user.id, { paymentMethod: "COD" })));
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);
    expect((await prisma.productVariant.findUniqueOrThrow({ where: { id: product.variants[0].id } })).stockQuantity).toBe(0);
  });
});

afterAll(async () => {
  await prisma.order.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.cart.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  await prisma.product.deleteMany({ where: { id: { in: createdProductIds } } });
  await prisma.category.deleteMany({ where: { id: { in: createdCategoryIds } } });
  await prisma.$disconnect();
});
