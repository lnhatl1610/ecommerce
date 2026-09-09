import { Router } from "express";
import { AddressController } from "./address.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { createAddressSchema, updateAddressSchema } from "./address.schema.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const addressRouter = Router();
const addressController = new AddressController();

addressRouter.use(requireAuth);

addressRouter.get("/", addressController.getMyAddresses);
addressRouter.post("/", validateBody(createAddressSchema), addressController.createAddress);
addressRouter.put("/:id", validateBody(updateAddressSchema), addressController.updateAddress);
addressRouter.put("/:id/default", addressController.setDefaultAddress);
addressRouter.delete("/:id", addressController.deleteAddress);

export { addressRouter };
