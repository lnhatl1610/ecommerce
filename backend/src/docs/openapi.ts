const bearerSecurity = [{ bearerAuth: [] }];

export const openapiDocument = {
  openapi: "3.0.3",
  info: {
    title: "SHOP.CO API",
    version: "1.0.0",
    description: "REST API for the SHOP.CO ecommerce platform.",
  },
  servers: [{ url: "http://localhost:3000", description: "Local backend" }],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Users" },
    { name: "Catalog" },
    { name: "Cart" },
    { name: "Orders" },
    { name: "Account" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      refreshCookie: { type: "apiKey", in: "cookie", name: "storefrontRefreshToken" },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation failed" },
          error: { type: "array", items: { type: "object" } },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          slug: { type: "string" },
          basePrice: { type: "number" },
          status: { type: "string", enum: ["DRAFT", "ACTIVE", "ARCHIVED"] },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password", minLength: 8 },
        },
      },
    },
    parameters: {
      Id: { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
    },
    responses: {
      BadRequest: { description: "Invalid request" },
      Unauthorized: { description: "Authentication required" },
      Forbidden: { description: "Insufficient permissions" },
    },
  },
  paths: {
    "/health": {
      get: { tags: ["Health"], summary: "Health check", responses: { "200": { description: "Backend is healthy" } } },
    },
    "/api/auth/register": {
      post: { tags: ["Auth"], summary: "Register a customer", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } } }, responses: { "201": { description: "Registered" }, "400": { $ref: "#/components/responses/BadRequest" } } },
    },
    "/api/auth/login": {
      post: { tags: ["Auth"], summary: "Login", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } } }, responses: { "200": { description: "Authenticated; sets a client-specific refresh cookie" }, "401": { description: "Invalid credentials" } } },
    },
    "/api/auth/refresh": {
      post: { tags: ["Auth"], summary: "Refresh access token", security: [{ refreshCookie: [] }], responses: { "200": { description: "New access token" }, "401": { description: "Invalid refresh token" } } },
    },
    "/api/auth/logout": {
      post: { tags: ["Auth"], summary: "Logout", responses: { "200": { description: "Refresh cookies cleared" } } },
    },
    "/api/users/me": {
      get: { tags: ["Users"], summary: "Get current user", security: bearerSecurity, responses: { "200": { description: "Current user" }, "401": { $ref: "#/components/responses/Unauthorized" } } },
      put: { tags: ["Users"], summary: "Update current user", security: bearerSecurity, responses: { "200": { description: "Updated user" }, "401": { $ref: "#/components/responses/Unauthorized" } } },
    },
    "/api/products": {
      get: { tags: ["Catalog"], summary: "List products", parameters: [{ name: "search", in: "query", schema: { type: "string" } }, { name: "page", in: "query", schema: { type: "integer", minimum: 1 } }], responses: { "200": { description: "Product list", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Product" } } } } } } },
      post: { tags: ["Catalog"], summary: "Create product", security: bearerSecurity, responses: { "201": { description: "Created" }, "403": { $ref: "#/components/responses/Forbidden" } } },
    },
    "/api/products/{id}": {
      get: { tags: ["Catalog"], summary: "Get product by ID", parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "200": { description: "Product details" }, "404": { description: "Not found" } } },
      put: { tags: ["Catalog"], summary: "Update product", security: bearerSecurity, parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "200": { description: "Updated" } } },
      delete: { tags: ["Catalog"], summary: "Delete product", security: bearerSecurity, parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "204": { description: "Deleted" } } },
    },
    "/api/categories": {
      get: { tags: ["Catalog"], summary: "List categories", responses: { "200": { description: "Category list" } } },
    },
    "/api/cart": {
      get: { tags: ["Cart"], summary: "Get current cart", security: bearerSecurity, responses: { "200": { description: "Cart" } } },
    },
    "/api/cart/items": {
      post: { tags: ["Cart"], summary: "Add item to cart", security: bearerSecurity, responses: { "201": { description: "Item added" } } },
    },
    "/api/orders": {
      get: { tags: ["Orders"], summary: "List current user's orders", security: bearerSecurity, responses: { "200": { description: "Order list" } } },
      post: { tags: ["Orders"], summary: "Create order at checkout", security: bearerSecurity, responses: { "201": { description: "Order created" } } },
    },
    "/api/orders/{id}": {
      get: { tags: ["Orders"], summary: "Get order details", security: bearerSecurity, parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "200": { description: "Order details" } } },
    },
    "/api/account/overview": {
      get: { tags: ["Account"], summary: "Get account overview", security: bearerSecurity, responses: { "200": { description: "Account overview" } } },
    },
  },
};
