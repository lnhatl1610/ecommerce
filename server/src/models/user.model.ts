import { Schema, model } from "mongoose";
import type { User } from "../interfaces/user.interface.js";

const userSchema = new Schema<User>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        age: { type: Number, required: false },
        isActive: { type: Boolean, default: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        phone: { type: String, required: false },
        address: { type: String, required: false },
    },
    { timestamps: true }
);

export const UserModel = model<User>("User", userSchema);
