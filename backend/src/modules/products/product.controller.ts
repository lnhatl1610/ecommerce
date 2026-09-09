import type { Request, Response } from "express";
import { ProductService } from "./product.service.js";
import type { CreateProductDTO, UpdateProductDTO, CreateProductVariantDTO, UpdateProductVariantDTO } from "./product.dto.js";
import type { ProductQueryParams } from "./product.types.js";
import type { ProductQueryInput } from "./product.schema.js";
import { sendSuccess, sendError } from "../../lib/response.js";

export class ProductController {
  private productService: ProductService;

  constructor(productService?: ProductService) {
    this.productService = productService ?? new ProductService();
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Unknown error";
  }

  createProduct = async (req: Request, res: Response) => {
    try {
      const data: CreateProductDTO = req.body;

      if (!data || !data.name || data.basePrice === undefined || !data.description || !data.categoryId) {
        return sendError(res, "Missing required fields: name, basePrice, description, categoryId", 400);
      }

      const product = await this.productService.createProduct(data);
      return sendSuccess(res, product, "Product created successfully", 201);
    } catch (error: unknown) {
      const message = this.getErrorMessage(error);
      if (message.includes("already exists") || message.includes("does not exist")) {
        return sendError(res, message, 400);
      }
      return sendError(res, "Failed to create product", 500, message);
    }
  };

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const params = req.query as ProductQueryInput satisfies ProductQueryParams;

      const result = await this.productService.getAllProducts(params);
      return sendSuccess(res, result, "Products fetched successfully");
    } catch (error: unknown) {
      return sendError(res, "Failed to fetch products", 500, this.getErrorMessage(error));
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      if (!id || typeof id !== "string") {
        return sendError(res, "Missing or invalid product ID", 400);
      }

      const product = await this.productService.getProductById(id);
      if (!product) return sendError(res, "Product not found", 404);

      return sendSuccess(res, product, "Product fetched successfully");
    } catch (error: unknown) {
      return sendError(res, "Failed to fetch product", 500, this.getErrorMessage(error));
    }
  };

  getProductBySlug = async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug as string;

      if (!slug || typeof slug !== "string") {
        return sendError(res, "Missing or invalid slug", 400);
      }

      const product = await this.productService.getProductBySlug(slug);
      if (!product) return sendError(res, "Product not found", 404);

      return sendSuccess(res, product, "Product fetched successfully");
    } catch (error: unknown) {
      return sendError(res, "Failed to fetch product", 500, this.getErrorMessage(error));
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const data: UpdateProductDTO = req.body;

      if (!id || typeof id !== "string") {
        return sendError(res, "Missing or invalid product ID", 400);
      }

      const product = await this.productService.updateProduct(id, data);
      if (!product) return sendError(res, "Product not found", 404);

      return sendSuccess(res, product, "Product updated successfully");
    } catch (error: unknown) {
      const message = this.getErrorMessage(error);
      if (message.includes("already exists") || message.includes("does not exist")) {
        return sendError(res, message, 400);
      }
      return sendError(res, "Failed to update product", 500, message);
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      if (!id || typeof id !== "string") {
        return sendError(res, "Missing or invalid product ID", 400);
      }

      const product = await this.productService.deleteProduct(id);
      if (!product) return sendError(res, "Product not found", 404);

      return sendSuccess(res, null, "Product deleted successfully");
    } catch (error: unknown) {
      return sendError(res, "Failed to delete product", 500, this.getErrorMessage(error));
    }
  };

  createVariant = async (req: Request, res: Response) => {
    try {
      const variant = await this.productService.createVariant(req.params.id as string, req.body as CreateProductVariantDTO);
      return sendSuccess(res, variant, "Variant created successfully", 201);
    } catch (error: unknown) {
      const message = this.getErrorMessage(error);
      return sendError(res, message.includes("already exists") ? message : "Failed to create variant", message.includes("already exists") ? 409 : 400, message);
    }
  };

  updateVariant = async (req: Request, res: Response) => {
    try {
      const variant = await this.productService.updateVariant(req.params.id as string, req.params.variantId as string, req.body as UpdateProductVariantDTO);
      if (!variant) return sendError(res, "Variant not found", 404);
      return sendSuccess(res, variant, "Variant updated successfully");
    } catch (error: unknown) {
      const message = this.getErrorMessage(error);
      return sendError(res, message.includes("already exists") ? message : "Failed to update variant", message.includes("already exists") ? 409 : 400, message);
    }
  };

  deleteVariant = async (req: Request, res: Response) => {
    try {
      const variant = await this.productService.deleteVariant(req.params.id as string, req.params.variantId as string);
      if (!variant) return sendError(res, "Variant not found", 404);
      return sendSuccess(res, null, "Variant deleted successfully");
    } catch (error: unknown) {
      return sendError(res, "Failed to delete variant", 400, this.getErrorMessage(error));
    }
  };
}
