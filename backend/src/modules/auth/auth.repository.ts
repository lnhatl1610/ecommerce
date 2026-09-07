import { AuthDAO } from "./auth.dao.js";
import type { User } from "./auth.types.js";

export class AuthRepository {
  private authDAO: AuthDAO;

  constructor(authDAO?: AuthDAO) {
    this.authDAO = authDAO ?? new AuthDAO();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.authDAO.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return await this.authDAO.findById(id);
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<User> {
    return await this.authDAO.create(data);
  }

  async updateLastLogin(id: string): Promise<User> {
    return await this.authDAO.updateLastLogin(id);
  }
}
