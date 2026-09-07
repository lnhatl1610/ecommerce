import type { Request, Response } from "express";
import { CategoryService } from "./category.service.js";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "./category.dto.js";
import { sendSuccess, sendError } from "../../lib/response.js";

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService?: CategoryService) {
    this.categoryService = categoryService ?? new CategoryService();
  }

  createCategory = async (req: Request, res: Response) => {
    try {
      const data: CreateCategoryDTO = req.body;
      const category = await this.categoryService.createCategory(data);
      return sendSuccess(res, category, "Category created successfully", 201);
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        return sendError(res, err.message, 409);
      }
      return sendError(res, "Failed to create category", 500, err.message ?? err);
    }
  };

  getAllCategories = async (req: Request, res: Response) => {
    try {
      const onlyRoot = req.query.root === "true";
      const categories = await this.categoryService.getAllCategories(onlyRoot);
      return sendSuccess(res, categories, "Categories fetched successfully");
    } catch (err: any) {
      return sendError(res, "Failed to fetch categories", 500, err.message ?? err);
    }
  };

  getCategoryById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      if (!id || typeof id !== "string") {
        return sendError(res, "Missing or invalid category ID", 400);
      }

      const category = await this.categoryService.getCategoryById(id);
      if (!category) {
        return sendError(res, "Category not found", 404);
      }

      return sendSuccess(res, category, "Category fetched successfully");
    } catch (err: any) {
      return sendError(res, "Failed to fetch category", 500, err.message ?? err);
    }
  };

  getCategoryBySlug = async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug as string;

      if (!slug || typeof slug !== "string") {
        return sendError(res, "Missing or invalid slug", 400);
      }

      const category = await this.categoryService.getCategoryBySlug(slug);
      if (!category) {
        return sendError(res, "Category not found", 404);
      }

      return sendSuccess(res, category, "Category fetched successfully");
    } catch (err: any) {
      return sendError(res, "Failed to fetch category", 500, err.message ?? err);
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const data: UpdateCategoryDTO = req.body;

      if (!id || typeof id !== "string") {
        return sendError(res, "Missing or invalid category ID", 400);
      }

      const category = await this.categoryService.updateCategory(id, data);
      if (!category) {
        return sendError(res, "Category not found", 404);
      }

      return sendSuccess(res, category, "Category updated successfully");
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        return sendError(res, err.message, 409);
      }
      return sendError(res, "Failed to update category", 500, err.message ?? err);
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      if (!id || typeof id !== "string") {
        return sendError(res, "Missing or invalid category ID", 400);
      }

      const category = await this.categoryService.deleteCategory(id);
      if (!category) {
        return sendError(res, "Category not found", 404);
      }

      return sendSuccess(res, null, "Category deleted successfully");
    } catch (err: any) {
      return sendError(res, "Failed to delete category", 500, err.message ?? err);
    }
  };
}
