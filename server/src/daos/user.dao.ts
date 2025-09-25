import type { User } from "../interfaces/user.interface.js";
import { UserModel } from "../models/user.model.js";

export class UserDAO {
    async create(user: Partial<User>): Promise<User> {
        const newUser = await UserModel.create(user);
        return newUser.toObject();
    }

    async findAll(): Promise<User[]> {
        const users = await UserModel.find();
        return users.map(u => u.toObject());
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);
        return user ? user.toObject() : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });
        return user ? user.toObject() : null;
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        const updated = await UserModel.findByIdAndUpdate(id, data, { new: true });
        return updated ? updated.toObject() : null;
    }

    async delete(id: string): Promise<User | null> {
        const deleted = await UserModel.findByIdAndDelete(id);
        return deleted ? deleted.toObject() : null;
    }
}

