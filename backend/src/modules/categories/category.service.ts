import { CategoryRepository } from "./category.repository.js";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "./category.dto.js";
import type { Category, CategoryWithChildren } from "./category.types.js";

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export class CategoryService {
  private categoryRepo: CategoryRepository;

  constructor(categoryRepo?: CategoryRepository) {
    this.categoryRepo = categoryRepo ?? new CategoryRepository();
  }

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);

    const existing = await this.categoryRepo.findBySlug(slug);
    if (existing) {
      throw new Error(`Category with slug "${slug}" already exists`);
    }

    if (data.parentId) {
      const parent = await this.categoryRepo.findById(data.parentId);
      if (!parent) {
        throw new Error("Parent category not found");
      }
    }

    return await this.categoryRepo.create({ ...data, slug });
  }

  async getAllCategories(onlyRoot = false): Promise<CategoryWithChildren[]> {
    return await this.categoryRepo.findAll(onlyRoot);
  }

  async getCategoryById(id: string): Promise<CategoryWithChildren | null> {
    return await this.categoryRepo.findById(id);
  }

  async getCategoryBySlug(slug: string): Promise<CategoryWithChildren | null> {
    return await this.categoryRepo.findBySlug(slug);
  }

  async updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category | null> {
    const updateData: UpdateCategoryDTO = { ...data };

    if (data.name && !data.slug) {
      updateData.slug = generateSlug(data.name);
    } else if (data.slug) {
      updateData.slug = generateSlug(data.slug);
    }

    if (updateData.slug) {
      const existing = await this.categoryRepo.findBySlug(updateData.slug);
      if (existing && existing.id !== id) {
        throw new Error(`Category with slug "${updateData.slug}" already exists`);
      }
    }

    if (data.parentId) {
      if (data.parentId === id) {
        throw new Error("Category cannot be its own parent");
      }
      const parent = await this.categoryRepo.findById(data.parentId);
      if (!parent) {
        throw new Error("Parent category not found");
      }
    }

    return await this.categoryRepo.update(id, updateData);
  }

  async deleteCategory(id: string): Promise<Category | null> {
    return await this.categoryRepo.delete(id);
  }
}

