import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import type { User } from "../interfaces/user.interface.js";

export class UserController {
    private userService: UserService;

    constructor(userService?: UserService) {
        this.userService = userService ?? new UserService();
    }

    createUser = async (req: Request, res: Response) => {
        try {
            const data: Partial<User> = req.body;

            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ message: "Missing user data in request body" });
            }

            const user = await this.userService.createUser(data);
            res.status(201).json(user);

        } catch (err) {
            res.status(500).json({ message: "Failed to create user", error: err });
        }
    };

    getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch users", error: err });
        }
    };

    getUserById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            if (!id) {
                return res.status(400).json({ message: "Missing user ID in parameters" });
            }

            const user = await this.userService.getUserById(id);
            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json(user);

        } catch (err) {
            res.status(500).json({ message: "Failed to fetch user", error: err });
        }
    };

    getUserByEmail = async (req: Request, res: Response) => {
        try {
            const email = req.params.email;

            if (!email) {
                return res.status(400).json({ message: "Missing email in parameters" });
            }

            const user = await this.userService.getUserByEmail(email);
            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json(user);

        } catch (err) {
            res.status(500).json({ message: "Failed to fetch user", error: err });
        }
    };

    updateUser = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data: Partial<User> = req.body;

            if (!id) {
                return res.status(400).json({ message: "Missing user ID in parameters" });
            }

            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ message: "Missing user data in request body" });
            }

            const user = await this.userService.updateUser(id, data);
            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json(user);

        } catch (err) {
            res.status(500).json({ message: "Failed to update user", error: err });
        }
    };

    deleteUser = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            if (!id) {
                return res.status(400).json({ message: "Missing user ID in parameters" });
            }

            const user = await this.userService.deleteUser(id);
            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json({ message: "User deleted successfully" });

        } catch (err) {
            res.status(500).json({ message: "Failed to delete user", error: err });
        }
    };
}
