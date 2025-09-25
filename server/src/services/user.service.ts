import { UserRepository } from "../repositories/user.repository.js";
import type { User } from "../interfaces/user.interface.js";

export class UserService {
    private userRepo: UserRepository;

    constructor(userRepo?: UserRepository) {
        this.userRepo = userRepo ?? new UserRepository();
    }

    async createUser(data: Partial<User>): Promise<User> {
        const user = await this.userRepo.create(data);
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        const user = await this.userRepo.findAll();
        return user;
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await this.userRepo.findById(id);
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.userRepo.findByEmail(email);
        return user;
    }

    async updateUser(id: string, data: Partial<User>): Promise<User | null> {
        const user = await this.userRepo.update(id, data);
        return user;
    }

    async deleteUser(id: string): Promise<User | null> {
        const user = await this.userRepo.delete(id);
        return user;
    }
}
