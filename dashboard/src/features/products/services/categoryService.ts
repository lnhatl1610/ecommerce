import type { 
    CreateCategory, 
    UpdateCategory, 
    Category 
} from "../types/product.types";
import api from "@/lib/api";

export const categoryService = {
    getCategories: () => 
        api.get<{ success: boolean; data: Category[] }>("/categories"),
    getCategoryById: (id: string) => 
        api.get<{ success: boolean; data: Category }>(`/categories/${id}`),
    getCategoryBySlug: (slug: string) => 
        api.get<{ success: boolean; data: Category }>(`/categories/slug/${slug}`),
    createCategory: (data: CreateCategory) => 
        api.post<{ success: boolean; data: Category }>("/categories", data),
    updateCategory: (data: UpdateCategory) => 
        api.put<{ success: boolean; data: Category }>(`/categories/${data.id}`, data),
    deleteCategory: (id: string) => 
        api.delete<{ success: boolean; message: string }>(`/categories/${id}`),
};

export default categoryService;
