import type { Category, CategoryWithChildren } from "./category.types.js";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "./category.dto.js";
import prisma from "../../config/db.js";

export class CategoryDAO {
  async create(data: CreateCategoryDTO & { slug: string }): Promise<Category> {
    return await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl,
        parentId: data.parentId,
      },
    });
  }

  async findAll(onlyRoot = false): Promise<CategoryWithChildren[]> {
    return await prisma.category.findMany({
      where: onlyRoot ? { parentId: null } : undefined,
      include: {
        children: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string): Promise<CategoryWithChildren | null> {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<CategoryWithChildren | null> {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  async update(id: string, data: UpdateCategoryDTO): Promise<Category | null> {
    try {
      return await prisma.category.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<Category | null> {
    try {
      return await prisma.category.delete({
        where: { id },
      });
    } catch {
      return null;
    }
  }
}

