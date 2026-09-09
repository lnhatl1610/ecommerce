import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { AccountController } from "./account.controller.js";
const accountRouter = Router();
const controller = new AccountController();
accountRouter.use(requireAuth);
accountRouter.get("/overview", controller.overview);
export { accountRouter };
