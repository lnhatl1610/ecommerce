import type { 
    CreateProduct, 
    UpdateProduct, 
    Product, 
    ProductQueryParams, 
    PaginatedProducts 
    , ProductVariant, CreateProductVariant, UpdateProductVariant
} from "../types/product.types";
import api from "@/lib/api";

export const productService = {
    uploadThumbnail: async (file: File): Promise<string> => {
        try {
            const signatureResponse = await api.post<{ success: boolean; data: { cloudName: string; apiKey: string; timestamp: number; folder: string; signature: string } }>("/upload/signature", { folder: "ecommerce/products" });
            const signature = signatureResponse.data.data;
            const body = new FormData();
            body.append("file", file);
            body.append("api_key", signature.apiKey);
            body.append("timestamp", String(signature.timestamp));
            body.append("folder", signature.folder);
            body.append("signature", signature.signature);
            const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, { method: "POST", body });
            const result = await response.json() as { secure_url?: string; error?: { message?: string } };
            if (!response.ok || !result.secure_url) throw new Error(result.error?.message ?? "Cloudinary upload failed");
            return result.secure_url;
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { message?: string } } }).response;
            throw new Error(response?.data?.message ?? (error instanceof Error ? error.message : "Image upload failed"));
        }
    },
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
    createVariant: (productId: string, data: CreateProductVariant) =>
        api.post<{ success: boolean; data: ProductVariant }>(`/products/${productId}/variants`, data),
    updateVariant: (productId: string, data: UpdateProductVariant) =>
        api.put<{ success: boolean; data: ProductVariant }>(`/products/${productId}/variants/${data.id}`, data),
    deleteVariant: (productId: string, variantId: string) =>
        api.delete<{ success: boolean; message: string }>(`/products/${productId}/variants/${variantId}`),
};

export default productService;
