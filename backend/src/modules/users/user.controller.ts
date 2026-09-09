import type { Request, Response } from "express";
import { UserService } from "./user.service.js";
import type { CreateUserDTO, UpdateUserDTO } from "./user.dto.js";
import type { SafeUser, User } from "./user.types.js";
import { sendSuccess, sendError } from "../../lib/response.js";

const sanitizeUser = (user: User | null): SafeUser | null => {
  if (!user) return null;
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
};

export class UserController {
  private userService: UserService;

  constructor(userService?: UserService) {
    this.userService = userService ?? new UserService();
  }

  getMe = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendError(res, "Authentication required", 401);
      }

      const user = await this.userService.getUserById(req.user.userId);
      if (!user) {
        return sendError(res, "User not found", 404);
      }

      return sendSuccess(res, sanitizeUser(user), "Profile fetched successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch profile";
      return sendError(res, "Failed to fetch profile", 500, message);
    }
  };

  updateMe = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendError(res, "Authentication required", 401);
      }

      const data: UpdateUserDTO = req.body;
      const user = await this.userService.updateUser(req.user.userId, data);
      if (!user) {
        return sendError(res, "User not found", 404);
      }

      return sendSuccess(res, sanitizeUser(user), "Profile updated successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      return sendError(res, "Failed to update profile", 500, message);
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const data: CreateUserDTO = req.body;

      const existingUser = await this.userService.getUserByEmail(data.email);
      if (existingUser) {
        return sendError(res, "Email already registered", 409);
      }

      const user = await this.userService.createUser(data);
      return sendSuccess(res, sanitizeUser(user), "User created successfully", 201);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create user";
      return sendError(res, "Failed to create user", 500, message);
    }
  };

  getAllUsers = async (_req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      return sendSuccess(
        res,
        users.map((user) => sanitizeUser(user)),
        "Users fetched successfully",
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch users";
      return sendError(res, "Failed to fetch users", 500, message);
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      if (!id || typeof id !== "string") {
        return sendError(res, "Missing or invalid user ID in parameters", 400);
      }

      const user = await this.userService.getUserById(id);
      if (!user) {
        return sendError(res, "User not found", 404);
      }

      return sendSuccess(res, sanitizeUser(user), "User fetched successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch user";
      return sendError(res, "Failed to fetch user", 500, message);
    }
  };

  getUserByEmail = async (req: Request, res: Response) => {
    try {
      const email = req.params.email as string;

      if (!email || typeof email !== "string") {
        return sendError(res, "Missing or invalid email in parameters", 400);
      }

      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return sendError(res, "User not found", 404);
      }

      return sendSuccess(res, sanitizeUser(user), "User fetched successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch user";
      return sendError(res, "Failed to fetch user", 500, message);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const data: UpdateUserDTO = req.body;

      if (!id || typeof id !== "string") {
        return sendError(res, "Missing or invalid user ID in parameters", 400);
      }

      const user = await this.userService.updateUser(id, data);
      if (!user) {
        return sendError(res, "User not found", 404);
      }

      return sendSuccess(res, sanitizeUser(user), "User updated successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update user";
      return sendError(res, "Failed to update user", 500, message);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      if (!id || typeof id !== "string") {
        return sendError(res, "Missing or invalid user ID in parameters", 400);
      }

      const user = await this.userService.deleteUser(id);
      if (!user) {
        return sendError(res, "User not found", 404);
      }

      return sendSuccess(res, null, "User deleted successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete user";
      return sendError(res, "Failed to delete user", 500, message);
    }
  };
}
