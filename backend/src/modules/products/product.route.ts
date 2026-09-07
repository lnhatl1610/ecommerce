import { Router } from "express";
import { ProductController } from "./product.controller.js";

const productRouter = Router();
const productController = new ProductController();

productRouter.post("/", productController.createProduct);
productRouter.get("/", productController.getAllProducts);
productRouter.get("/slug/:slug", productController.getProductBySlug);
productRouter.get("/:id", productController.getProductById);
productRouter.put("/:id", productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);

export { productRouter };

