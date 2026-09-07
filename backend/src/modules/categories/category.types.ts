import type { Category as PrismaCategory } from "@prisma/client";

export interface Category extends PrismaCategory { }

export interface CategoryWithChildren extends Category {
  children?: Category[];
}

export interface CategoryWithParent extends Category {
  parent?: Category | null;
}

