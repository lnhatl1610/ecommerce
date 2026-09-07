import type { CreateUser, UpdateUser, User } from "../types/user.types";
import api from "@/lib/api";

export const userService = {
    getUsers: () => api.get<{ success: boolean; data: User[] }>("/users"),
    getUserById: (id: string) => api.get<{ success: boolean; data: User }>(`/users/${id}`),
    createUser: (data: CreateUser) => api.post<{ success: boolean; data: User }>("/users", data),
    updateUser: (data: UpdateUser) => api.put<{ success: boolean; data: User }>(`/users/${data.id}`, data),
    deleteUser: (id: string) => api.delete<{ success: boolean; message: string }>(`/users/${id}`),
};

export default userService;
