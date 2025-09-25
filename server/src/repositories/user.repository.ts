import { UserDAO } from "../daos/user.dao.js";
import type { User } from "../interfaces/user.interface.js";

export class UserRepository {
    private userDAO: UserDAO;

    constructor(userDAO?: UserDAO) {
        this.userDAO = userDAO ?? new UserDAO();
    }

    async create(data: Partial<User>): Promise<User> {
        const user = await this.userDAO.create(data);
        return user;
    }

    async findAll(): Promise<User[]> {
        const users = await this.userDAO.findAll();
        return users;
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.userDAO.findById(id);
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userDAO.findByEmail(email);
        return user;
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        const user = await this.userDAO.update(id, data);
        return user;
    }

    async delete(id: string): Promise<User | null> {
        const user = await this.userDAO.delete(id);
        return user;
    }
}
