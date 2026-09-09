export interface ApiEnvelope<T> { success: boolean; message: string; data: T }
export interface PaginatedResponse<T> { items: T[]; page: number; limit: number; total: number; totalPages: number }
