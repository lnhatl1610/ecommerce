import { ProductRepository } from "./product.repository.js";
import { CategoryRepository } from "../categories/category.repository.js";
import type { CreateProductDTO, UpdateProductDTO, CreateProductVariantDTO, UpdateProductVariantDTO } from "./product.dto.js";
import type {
  Product,
  ProductWithCategory,
  ProductQueryParams,
  PaginatedProducts,
} from "./product.types.js";

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const generateSku = (name: string): string => {
  const prefix = name
    .trim()
    .slice(0, 3)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "X");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${Date.now().toString().slice(-4)}-${random}`;
};

export class ProductService {
  private productRepo: ProductRepository;
  private categoryRepo: CategoryRepository;

  constructor(productRepo?: ProductRepository, categoryRepo?: CategoryRepository) {
    this.productRepo = productRepo ?? new ProductRepository();
    this.categoryRepo = categoryRepo ?? new CategoryRepository();
  }

  async createProduct(data: CreateProductDTO): Promise<Product> {
    const category = await this.categoryRepo.findById(data.categoryId);
    if (!category) {
      throw new Error(`Category with ID "${data.categoryId}" does not exist`);
    }

    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);
    const existingSlug = await this.productRepo.findBySlug(slug);
    if (existingSlug) {
      throw new Error(`Product with slug "${slug}" already exists`);
    }

    const sku = data.sku ? data.sku.trim().toUpperCase() : generateSku(data.name);
    const existingSku = await this.productRepo.findBySku(sku);
    if (existingSku) {
      throw new Error(`Product with SKU "${sku}" already exists`);
    }

    return await this.productRepo.create({
      ...data,
      slug,
      sku,
    });
  }

  async getAllProducts(params?: ProductQueryParams): Promise<PaginatedProducts> {
    return await this.productRepo.findAll(params);
  }

  async getProductById(id: string): Promise<ProductWithCategory | null> {
    return await this.productRepo.findById(id);
  }

  async getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
    return await this.productRepo.findBySlug(slug);
  }

  async updateProduct(id: string, data: UpdateProductDTO): Promise<Product | null> {
    if (data.categoryId) {
      const category = await this.categoryRepo.findById(data.categoryId);
      if (!category) {
        throw new Error(`Category with ID "${data.categoryId}" does not exist`);
      }
    }

    const updateData: UpdateProductDTO = { ...data };

    if (data.name && !data.slug) {
      updateData.slug = generateSlug(data.name);
    } else if (data.slug) {
      updateData.slug = generateSlug(data.slug);
    }

    if (updateData.slug) {
      const existing = await this.productRepo.findBySlug(updateData.slug);
      if (existing && existing.id !== id) {
        throw new Error(`Product with slug "${updateData.slug}" already exists`);
      }
    }

    if (data.sku) {
      updateData.sku = data.sku.trim().toUpperCase();
      const existingSku = await this.productRepo.findBySku(updateData.sku);
      if (existingSku && existingSku.id !== id) {
        throw new Error(`Product with SKU "${updateData.sku}" already exists`);
      }
    }

    return await this.productRepo.update(id, updateData);
  }

  async deleteProduct(id: string): Promise<Product | null> {
    return await this.productRepo.delete(id);
  }

  async createVariant(productId: string, data: CreateProductVariantDTO) {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error("Product not found");
    const existing = await this.productRepo.findVariantBySku(data.sku.trim().toUpperCase());
    if (existing) throw new Error(`Variant with SKU "${data.sku}" already exists`);
    return await this.productRepo.createVariant(productId, { ...data, sku: data.sku.trim().toUpperCase() });
  }

  async updateVariant(productId: string, variantId: string, data: UpdateProductVariantDTO) {
    if (data.sku) {
      const existing = await this.productRepo.findVariantBySku(data.sku.trim().toUpperCase());
      if (existing && existing.id !== variantId) throw new Error(`Variant with SKU "${data.sku}" already exists`);
      data = { ...data, sku: data.sku.trim().toUpperCase() };
    }
    return await this.productRepo.updateVariant(productId, variantId, data);
  }

  async deleteVariant(productId: string, variantId: string) {
    return await this.productRepo.deleteVariant(productId, variantId);
  }
}
