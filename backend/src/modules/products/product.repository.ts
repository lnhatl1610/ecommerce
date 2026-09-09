import { ProductDAO } from "./product.dao.js";
import type { CreateProductDTO, UpdateProductDTO, CreateProductVariantDTO, UpdateProductVariantDTO } from "./product.dto.js";
import type {
  Product,
  ProductWithDetails,
  ProductQueryParams,
  PaginatedProducts,
} from "./product.types.js";

export class ProductRepository {
  private productDAO: ProductDAO;

  constructor(productDAO?: ProductDAO) {
    this.productDAO = productDAO ?? new ProductDAO();
  }

  async create(data: CreateProductDTO & { slug: string }): Promise<ProductWithDetails> {
    return await this.productDAO.create(data);
  }

  async findAll(params?: ProductQueryParams): Promise<PaginatedProducts> {
    return await this.productDAO.findAll(params);
  }

  async findById(id: string): Promise<ProductWithDetails | null> {
    return await this.productDAO.findById(id);
  }

  async findBySlug(slug: string): Promise<ProductWithDetails | null> {
    return await this.productDAO.findBySlug(slug);
  }

  async findBySku(sku: string): Promise<ProductWithDetails | null> {
    return await this.productDAO.findBySku(sku);
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product | null> {
    return await this.productDAO.update(id, data);
  }

  async delete(id: string): Promise<Product | null> {
    return await this.productDAO.delete(id);
  }

  async createVariant(productId: string, data: CreateProductVariantDTO) { return await this.productDAO.createVariant(productId, data); }
  async findVariantBySku(sku: string) { return await this.productDAO.findVariantBySku(sku); }
  async updateVariant(productId: string, variantId: string, data: UpdateProductVariantDTO) { return await this.productDAO.updateVariant(productId, variantId, data); }
  async deleteVariant(productId: string, variantId: string) { return await this.productDAO.deleteVariant(productId, variantId); }
}
