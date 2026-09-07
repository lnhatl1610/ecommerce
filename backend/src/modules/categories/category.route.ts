import { Router } from "express";
import { CategoryController } from "./category.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "./category.schema.js";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.post("/", validateBody(createCategorySchema), categoryController.createCategory);
categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/slug/:slug", categoryController.getCategoryBySlug);
categoryRouter.get("/:id", categoryController.getCategoryById);
categoryRouter.put("/:id", validateBody(updateCategorySchema), categoryController.updateCategory);
categoryRouter.delete("/:id", categoryController.deleteCategory);

export { categoryRouter };
