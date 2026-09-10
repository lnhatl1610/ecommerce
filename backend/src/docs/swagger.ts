import swaggerUi from "swagger-ui-express";
import { openapiDocument } from "./openapi.js";

export const swaggerMiddleware = swaggerUi.serve;
export const swaggerHandler = swaggerUi.setup(openapiDocument, {
  explorer: true,
  customSiteTitle: "SHOP.CO API Documentation",
});

