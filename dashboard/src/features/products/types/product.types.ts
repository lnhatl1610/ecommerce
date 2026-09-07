export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductVariant {
    id: string;
    productId: string;
    sku: string;
    attributes: Record<string, any>;
    price: number;
    stockQuantity: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProductImage {
    id: string;
    productId: string;
    url: string;
    order: number;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    categoryId: string;
    basePrice: number;
    thumbnail?: string;
    status: ProductStatus;
    category?: Category;
    variants?: ProductVariant[];
    images?: ProductImage[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateProduct {
    name: string;
    slug?: string;
    description: string;
    shortDescription?: string;
    categoryId: string;
    basePrice: number;
    thumbnail?: string;
    status?: ProductStatus;
    variants?: CreateProductVariant[];
    images?: string[];
    sku?: string;
}

export interface CreateProductVariant {
    sku: string;
    attributes?: Record<string, any>;
    price: number;
    stockQuantity?: number;
}

export interface UpdateProduct extends Partial<CreateProduct> {
    id: string;
}

export interface ProductQueryParams {
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: ProductStatus;
    page?: number;
    limit?: number;
    sortBy?: "basePrice" | "createdAt" | "name";
    sortOrder?: "asc" | "desc";
}

export interface PaginatedProducts {
    items: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CreateCategory {
    name: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
}

export interface UpdateCategory extends Partial<CreateCategory> {
    id: string;
}
