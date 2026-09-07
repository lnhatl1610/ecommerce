export interface CreateCategoryDTO {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  isActive?: boolean;
}

