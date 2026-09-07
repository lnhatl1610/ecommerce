import { UserRepository } from "./user.repository.js";
import type { User } from "./user.types.js";
import type { CreateUserDTO, UpdateUserDTO } from "./user.dto.js";
import bcrypt from "bcryptjs";

export class UserService {
  private userRepo: UserRepository;

  constructor(userRepo?: UserRepository) {
    this.userRepo = userRepo ?? new UserRepository();
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    if (data.password) {
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }

    return await this.userRepo.create(data);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepo.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepo.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findByEmail(email);
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<User | null> {
    if (data.password) {
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }
    return await this.userRepo.update(id, data);
  }

  async deleteUser(id: string): Promise<User | null> {
    return await this.userRepo.delete(id);
  }
}
