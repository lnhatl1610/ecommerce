import { CategoryDAO } from "./category.dao.js";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "./category.dto.js";
import type { Category, CategoryWithChildren } from "./category.types.js";

export class CategoryRepository {
  private categoryDAO: CategoryDAO;

  constructor(categoryDAO?: CategoryDAO) {
    this.categoryDAO = categoryDAO ?? new CategoryDAO();
  }

  async create(data: CreateCategoryDTO & { slug: string }): Promise<Category> {
    return await this.categoryDAO.create(data);
  }

  async findAll(onlyRoot = false): Promise<CategoryWithChildren[]> {
    return await this.categoryDAO.findAll(onlyRoot);
  }

  async findById(id: string): Promise<CategoryWithChildren | null> {
    return await this.categoryDAO.findById(id);
  }

  async findBySlug(slug: string): Promise<CategoryWithChildren | null> {
    return await this.categoryDAO.findBySlug(slug);
  }

  async update(id: string, data: UpdateCategoryDTO): Promise<Category | null> {
    return await this.categoryDAO.update(id, data);
  }

  async delete(id: string): Promise<Category | null> {
    return await this.categoryDAO.delete(id);
  }
}

