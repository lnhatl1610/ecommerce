import type {
  Product,
  ProductWithDetails,
  ProductQueryParams,
  PaginatedProducts,
} from "./product.types.js";
import type { CreateProductDTO, UpdateProductDTO, CreateProductVariantDTO, UpdateProductVariantDTO } from "./product.dto.js";
import prisma from "../../config/db.js";
import type { Prisma } from "@prisma/client";

export class ProductDAO {
  async create(data: CreateProductDTO & { slug: string }): Promise<ProductWithDetails> {
    return await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        thumbnail: data.thumbnail,
        status: data.status ?? "ACTIVE",
        variants: data.variants
          ? {
            create: data.variants.map((v) => ({
              sku: v.sku,
              attributes: v.attributes ?? {},
              price: v.price,
              stockQuantity: v.stockQuantity ?? 0,
            })),
          }
          : undefined,
        images: data.images
          ? {
            create: data.images.map((url, idx) => ({
              url,
              order: idx,
            })),
          }
          : undefined,
      },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });
  }

  async findAll(params: ProductQueryParams = {}): Promise<PaginatedProducts> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (params.status && params.status !== "ALL") {
      where.status = params.status;
    } else if (params.status !== "ALL") {
      where.status = "ACTIVE";
    }

    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.basePrice = {};
      if (params.minPrice !== undefined) {
        where.basePrice.gte = Number(params.minPrice);
      }
      if (params.maxPrice !== undefined) {
        where.basePrice.lte = Number(params.maxPrice);
      }
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (params.sortBy) {
      orderBy[params.sortBy] = params.sortOrder === "asc" ? "asc" : "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
          images: { orderBy: { order: "asc" } },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<ProductWithDetails | null> {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        images: { orderBy: { order: "asc" } },
      },
    });
  }

  async findBySlug(slug: string): Promise<ProductWithDetails | null> {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        images: { orderBy: { order: "asc" } },
      },
    });
  }

  async findBySku(sku: string): Promise<ProductWithDetails | null> {
    const variant = await prisma.productVariant.findUnique({
      where: { sku },
      include: {
        product: {
          include: {
            category: true,
            variants: true,
            images: { orderBy: { order: "asc" } },
          },
        },
      },
    });

    if (!variant) return null;

    return variant.product as ProductWithDetails;
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product | null> {
    try {
      return await prisma.product.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<Product | null> {
    try {
      return await prisma.product.delete({
        where: { id },
      });
    } catch {
      return null;
    }
  }

  async createVariant(productId: string, data: CreateProductVariantDTO) {
    return await prisma.productVariant.create({
      data: {
        productId,
        sku: data.sku,
        attributes: data.attributes ?? {},
        price: data.price,
        stockQuantity: data.stockQuantity ?? 0,
      },
    });
  }

  async findVariantBySku(sku: string) {
    return await prisma.productVariant.findUnique({ where: { sku } });
  }

  async findVariant(productId: string, variantId: string) {
    return await prisma.productVariant.findFirst({ where: { id: variantId, productId } });
  }

  async updateVariant(productId: string, variantId: string, data: UpdateProductVariantDTO) {
    const variant = await this.findVariant(productId, variantId);
    if (!variant) return null;
    return await prisma.productVariant.update({ where: { id: variantId }, data });
  }

  async deleteVariant(productId: string, variantId: string) {
    const variant = await this.findVariant(productId, variantId);
    if (!variant) return null;
    return await prisma.productVariant.delete({ where: { id: variantId } });
  }
}
