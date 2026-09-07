import { UserDAO } from "./user.dao.js";
import type { CreateUserDTO, UpdateUserDTO } from "./user.dto.js";
import type { User } from "./user.types.js";

export class UserRepository {
  private userDAO: UserDAO;

  constructor(userDAO?: UserDAO) {
    this.userDAO = userDAO ?? new UserDAO();
  }

  async create(data: CreateUserDTO): Promise<User> {
    return await this.userDAO.create(data);
  }

  async findAll(): Promise<User[]> {
    return await this.userDAO.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return await this.userDAO.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userDAO.findByEmail(email);
  }

  async update(id: string, data: UpdateUserDTO): Promise<User | null> {
    return await this.userDAO.update(id, data);
  }

  async delete(id: string): Promise<User | null> {
    return await this.userDAO.delete(id);
  }
}
