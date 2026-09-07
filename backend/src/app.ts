import express from "express";
import type { Application } from "express";
import cors from "cors";
import { userRouter } from "./modules/users/user.route.js";
import { categoryRouter } from "./modules/categories/category.route.js";
import { productRouter } from "./modules/products/product.route.js";
import { authRouter } from "./modules/auth/auth.route.js";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);

export default app;
