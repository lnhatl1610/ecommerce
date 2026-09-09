import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { validateBody, validateQuery } from "../../middlewares/validate.middleware.js";
import { createProductSchema, productQuerySchema, updateProductSchema, createProductVariantSchema, updateProductVariantSchema } from "./product.schema.js";

const productRouter = Router();
const productController = new ProductController();

productRouter.get("/", validateQuery(productQuerySchema), productController.getAllProducts);
productRouter.get("/slug/:slug", productController.getProductBySlug);
productRouter.get("/:id", productController.getProductById);

productRouter.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validateBody(createProductSchema),
  productController.createProduct,
);
productRouter.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateBody(updateProductSchema),
  productController.updateProduct,
);
productRouter.delete("/:id", requireAuth, requireRole("ADMIN"), productController.deleteProduct);
productRouter.post("/:id/variants", requireAuth, requireRole("ADMIN"), validateBody(createProductVariantSchema), productController.createVariant);
productRouter.put("/:id/variants/:variantId", requireAuth, requireRole("ADMIN"), validateBody(updateProductVariantSchema), productController.updateVariant);
productRouter.delete("/:id/variants/:variantId", requireAuth, requireRole("ADMIN"), productController.deleteVariant);

export { productRouter };
