import type { Request, Response } from "express";
import { ProductService } from "./product.service.js";
import type { CreateProductDTO, UpdateProductDTO } from "./product.dto.js";
import type { ProductQueryParams } from "./product.types.js";
import { sendSuccess, sendError } from "../../lib/response.js";

export class ProductController {
  private productService: ProductService;

  constructor(productService?: ProductService) {
    this.productService = productService ?? new ProductService();
  }

  createProduct = async (req: Request, res: Response) => {
    try {
      const data: CreateProductDTO = req.body;

      if (!data || !data.name || data.basePrice === undefined || !data.description || !data.categoryId) {
        return sendError(res, "Missing required fields: name, basePrice, description, categoryId", 400);
      }

      const product = await this.productService.createProduct(data);
      return sendSuccess(res, product, "Product created successfully", 201);
    } catch (err: any) {
      if (err.message?.includes("already exists") || err.message?.includes("does not exist")) {
        return sendError(res, err.message, 400);
      }
      return sendError(res, "Failed to create product", 500, err.message ?? err);
    }
  };

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const params: ProductQueryParams = {
        search: req.query.search as string | undefined,
        categoryId: req.query.categoryId as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };

      const result = await this.productService.getAllProducts(params);
      return sendSuccess(res, result, "Products fetched successfully");
    } catch (err: any) {
      return sendError(res, "Failed to fetch products", 500, err.message ?? err);
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
    } catch (err: any) {
      return sendError(res, "Failed to fetch product", 500, err.message ?? err);
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
    } catch (err: any) {
      return sendError(res, "Failed to fetch product", 500, err.message ?? err);
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
    } catch (err: any) {
      if (err.message?.includes("already exists") || err.message?.includes("does not exist")) {
        return sendError(res, err.message, 400);
      }
      return sendError(res, "Failed to update product", 500, err.message ?? err);
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
    } catch (err: any) {
      return sendError(res, "Failed to delete product", 500, err.message ?? err);
    }
  };
}

