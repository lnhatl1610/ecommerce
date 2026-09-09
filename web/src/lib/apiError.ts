import axios from "axios";
export const getApiErrorMessage = (error: unknown, fallback = "Đã xảy ra lỗi. Hãy thử lại.") => axios.isAxiosError(error) ? String(error.response?.data?.message ?? fallback) : fallback;
