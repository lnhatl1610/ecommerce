import type { 
    CreateProduct, 
    UpdateProduct, 
    Product, 
    ProductQueryParams, 
    PaginatedProducts 
} from "../types/product.types";
import api from "@/lib/api";

export const productService = {
    getProducts: (params?: ProductQueryParams) => 
        api.get<{ success: boolean; data: PaginatedProducts }>("/products", { params }),
    getProductById: (id: string) => 
        api.get<{ success: boolean; data: Product }>(`/products/${id}`),
    getProductBySlug: (slug: string) => 
        api.get<{ success: boolean; data: Product }>(`/products/slug/${slug}`),
    createProduct: (data: CreateProduct) => 
        api.post<{ success: boolean; data: Product }>("/products", data),
    updateProduct: (data: UpdateProduct) => 
        api.put<{ success: boolean; data: Product }>(`/products/${data.id}`, data),
    deleteProduct: (id: string) => 
        api.delete<{ success: boolean; message: string }>(`/products/${id}`),
};

export default productService;
