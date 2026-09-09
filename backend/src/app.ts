import express from "express";
import type { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { userRouter } from "./modules/users/user.route.js";
import { categoryRouter } from "./modules/categories/category.route.js";
import { productRouter } from "./modules/products/product.route.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { addressRouter } from "./modules/addresses/address.route.js";
import { cartRouter } from "./modules/cart/cart.route.js";
import { orderRouter } from "./modules/orders/order.route.js";
import { couponRouter } from "./modules/coupons/coupon.route.js";
import { reviewRouter } from "./modules/reviews/review.route.js";
import { wishlistRouter } from "./modules/wishlists/wishlist.route.js";
import { paymentRouter } from "./modules/payments/payment.route.js";
import { uploadRouter } from "./modules/upload/upload.route.js";
import { catalogExperienceRouter } from "./modules/catalog-experience/catalog-experience.route.js";
import { accountRouter } from "./modules/account/account.route.js";

const app: Application = express();

const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use((req, _res, next) => { console.info(JSON.stringify({ level: "info", method: req.method, path: req.path, at: new Date().toISOString() })); next(); });
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/experience", catalogExperienceRouter);
app.use("/api/account", accountRouter);

export default app;
