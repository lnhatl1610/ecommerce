import type { CreateUser } from "../interfaces/CreateUser";
import type { UpdateUser } from "../interfaces/UpdateUser";
import type { User } from "../interfaces/User";
import api from "./api";


const UserService = {
    getUsers: () => api.get<User[]>("/users"),
    getUserById: (id: number) => api.get<User>(`/users/${id}`),
    createUser: (data: CreateUser) => api.post<User>("/users", data),
    updateUser: (data: UpdateUser) => api.put<User>(`/users/${data.id}`, data),
    deleteUser: (id: number) => api.delete(`/users/${id}`),
};

export default UserService;
