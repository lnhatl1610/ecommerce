import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const password = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!", 10);
const productThumbnail = "https://lados.vn/wp-content/uploads/2024/07/a6ab5c8cf7d25316d9ab5655a1a1085f-1698382664001.jpeg";

try {
  const admin = await prisma.user.upsert({ where: { email: "admin@example.com" }, update: { role: "ADMIN", isActive: true }, create: { email: "admin@example.com", name: "Store Admin", password, role: "ADMIN" } });
  const demoUser = await prisma.user.upsert({ where: { email: "demo@example.com" }, update: { name: "Demo Customer", role: "CUSTOMER", isActive: true }, create: { email: "demo@example.com", name: "Demo Customer", password, role: "CUSTOMER" } });

  // Replace the catalog and remove all dependent records first.
  await prisma.$transaction([
    prisma.cartItem.deleteMany(), prisma.review.deleteMany(), prisma.wishlist.deleteMany(),
    prisma.orderItem.deleteMany(), prisma.payment.deleteMany(), prisma.order.deleteMany(),
    prisma.productImage.deleteMany(), prisma.productVariant.deleteMany(), prisma.product.deleteMany(),
  ]);

  const category = await prisma.category.findUnique({ where: { id: "867bdb9d-dd11-48a5-995d-9725918866fd" } })
    ?? await prisma.category.upsert({ where: { slug: "featured" }, update: {}, create: { name: "Featured", slug: "featured", description: "Featured products" } });

  for (let index = 1; index <= 100; index += 1) {
    const suffix = String(index).padStart(3, "0");
    await prisma.product.create({ data: {
      name: `Áo sơ mi nam ${suffix}`, slug: `ao-so-mi-nam-${suffix}`, description: "không có chi",
      categoryId: category.id, basePrice: 0.01, thumbnail: productThumbnail, status: "ACTIVE",
      images: { create: { url: productThumbnail, order: 0 } },
      variants: { create: { sku: `AO-SO-MI-NAM-${suffix}`, price: 0.01, stockQuantity: 100, attributes: { color: "White", size: "M" } } },
    } });
  }

  for (let index = 1; index <= 20; index += 1) {
    const email = `demo.user${index}@example.com`;
    await prisma.user.upsert({ where: { email }, update: { name: `Demo Customer ${index}`, role: "CUSTOMER", isActive: index % 7 !== 0 }, create: { email, name: `Demo Customer ${index}`, password, role: "CUSTOMER", isActive: index % 7 !== 0 } });
  }
  console.log(`Seeded admin ${admin.email}, user ${demoUser.email}, 20 demo users, and 100 shirt products`);
} finally {
  await prisma.$disconnect();
}
