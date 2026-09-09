import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { WishlistController } from "./wishlist.controller.js";
import { createWishlistSchema } from "./wishlist.schema.js";
const wishlistRouter = Router(); const controller = new WishlistController(); wishlistRouter.use(requireAuth); wishlistRouter.get("/", controller.list); wishlistRouter.post("/", validateBody(createWishlistSchema), controller.add); wishlistRouter.delete("/:productId", controller.remove); export { wishlistRouter };

