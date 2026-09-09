import { Router } from "express";
import { CategoryController } from "./category.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "./category.schema.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/slug/:slug", categoryController.getCategoryBySlug);
categoryRouter.get("/:id", categoryController.getCategoryById);

categoryRouter.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validateBody(createCategorySchema),
  categoryController.createCategory,
);
categoryRouter.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateBody(updateCategorySchema),
  categoryController.updateCategory,
);
categoryRouter.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  categoryController.deleteCategory,
);

export { categoryRouter };
