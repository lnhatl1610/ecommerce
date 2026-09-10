# Planning — Dự án E-commerce (Express + React + shadcn/ui + PostgreSQL)

## 0. Các thành phần cần có trong bộ planning (ngoài Skill & Rule)

| Thành phần | File | Mục đích |
|---|---|---|
| **PRD** | [PRD.md](./PRD.md) | Phạm vi & persona |
| **Architecture** | [ARCHITECTURE.md](./ARCHITECTURE.md) | Sơ đồ hệ thống, quyết định tech |
| **Project Structure** | [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Cây thư mục & naming |
| **Database / ERD** | [DATABASE.md](./DATABASE.md) | Model, index, migration |
| **API Spec** | [API_SPEC.md](./API_SPEC.md) | Endpoint & mã lỗi |
| **Coding Convention** | [CODING_CONVENTION.md](./CODING_CONVENTION.md) | Style, commit, branch |
| **Testing Strategy** | [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) | Unit/integration/e2e |
| **Environment** | [ENVIRONMENT.md](./ENVIRONMENT.md) | `.env` & secrets |
| **Security Checklist** | [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) | Auth, CORS, OWASP |
| **CI/CD Plan** | [CICD.md](./CICD.md) | Pipeline & deploy |
| **Roadmap** | [ROADMAP.md](./ROADMAP.md) | Milestone breakdown |
| **Definition of Done** | [DEFINITION_OF_DONE.md](./DEFINITION_OF_DONE.md) | Tiêu chí hoàn thành task |

---

## 1. Tech Stack

- **Backend**: Node.js + Express, TypeScript
- **Frontend Admin**: `dashboard/` - React 19 (Vite), shadcn/ui + Tailwind CSS v4
- **Frontend Storefront**: `web/` - React (Vite), shadcn/ui + Tailwind CSS v4
- **Database**: PostgreSQL
- **ORM**: Prisma ORM (quản lý migrations + 100% type-safety)
- **State Management (FE)**: TanStack Query (server state) + Zustand (client state: cart, UI)
- **Auth**: JWT (access token ~15p + refresh token httpOnly cookie ~7d), bcrypt cho password
- **Validation**: Zod (type-safe validation cho cả FE và BE)
- **File/ảnh**: Multer + lưu Cloudinary/S3 (không lưu local ở production)
- **Payment**: VNPay/Momo (nội địa VN) hoặc Stripe (quốc tế)
- **Email**: Nodemailer + SMTP hoặc Resend
- **Testing**: Vitest (unit), Supertest (API), Playwright (e2e)
- **Deploy**: Docker + docker-compose, CI qua GitHub Actions

---

## 2. Cấu Trúc Thư Mục Monorepo

```text
ecommerce/
├── backend/                    # Express RESTful API server
│   ├── prisma/
│   │   ├── schema.prisma       # Toàn bộ database schema PostgreSQL
│   │   └── migrations/
│   ├── src/
│   │   ├── config/             # env, database connection (Prisma singleton)
│   │   ├── middlewares/        # auth, error handler, rate-limit, validate (Zod)
│   │   ├── lib/                # helper dùng chung, standardized response
│   │   ├── modules/            # Theo domain: users, categories, products, cart, orders, coupons...
│   │   │   └── products/
│   │   │       ├── product.types.ts
│   │   │       ├── product.dto.ts
│   │   │       ├── product.schema.ts   (Zod validation schema)
│   │   │       ├── product.dao.ts
│   │   │       ├── product.repository.ts
│   │   │       ├── product.service.ts
│   │   │       ├── product.controller.ts
│   │   │       └── product.route.ts
│   │   ├── app.ts              # Express application setup, routes mount
│   │   └── server.ts           # Server bootstrap & listen
├── dashboard/                  # React 19 Admin Dashboard
│   ├── src/
│   │   ├── components/ui/      # shadcn/ui components
│   │   ├── features/           # Theo feature: users, products, orders, categories, analytics...
│   │   ├── layouts/            # DashboardLayout, Sidebar, Navbar
│   │   ├── lib/                # axios api client (@/lib/api), utils
│   │   ├── routes/             # dashboardRoutes.tsx
│   │   └── stores/             # Zustand state (UI state, auth state)
├── web/                        # React Storefront cho khách hàng mua sắm
├── .agents/                    # Bộ quy chuẩn Skills cho AI Coding Agent
│   └── skills/
├── AGENTS.md                   # Quy chuẩn chung monorepo
├── docs/planning.md            # Kế hoạch kỹ thuật và single source of truth
└── package.json                # npm workspaces root config
```

---

## 3. Database Schema (14 Models E-commerce Chuẩn)

- **User**: `id` (UUID), `email` (unique), `password`, `name`, `phone`, `avatar`, `role` (`CUSTOMER` / `ADMIN` / `STAFF`), `isActive`, `createdAt`, `updatedAt`
- **Address**: `id` (UUID), `userId`, `recipientName`, `phone`, `province`, `district`, `ward`, `detail`, `isDefault`
- **Category**: `id` (UUID), `name`, `slug` (unique), `description`, `imageUrl`, `parentId` (hỗ trợ danh mục con đệ quy), `isActive`
- **Product**: `id` (UUID), `name`, `slug` (unique), `description`, `shortDescription`, `categoryId`, `basePrice`, `thumbnail`, `status` (`DRAFT` / `ACTIVE`), `createdAt`, `updatedAt`
- **ProductVariant**: `id` (UUID), `productId`, `sku` (unique), `attributes` (JSON: size, color...), `price`, `stockQuantity`
- **ProductImage**: `id` (UUID), `productId`, `url`, `order`
- **Cart**: `id` (UUID), `userId` (null nếu khách vãng lai), `sessionId` (cho guest), `createdAt`, `updatedAt`
- **CartItem**: `id` (UUID), `cartId`, `variantId`, `quantity`
- **Order**: `id` (UUID), `userId`, `addressId`, `status` (`PENDING`, `PAID`, `SHIPPING`, `COMPLETED`, `CANCELLED`), `totalAmount`, `paymentMethod`, `couponId`, `createdAt`, `updatedAt`
- **OrderItem**: `id` (UUID), `orderId`, `variantId`, `quantity`, `priceAtPurchase`
- **Payment**: `id` (UUID), `orderId`, `provider` (COD, VNPAY, MOMO, STRIPE), `transactionId`, `status` (`PENDING`, `SUCCESS`, `FAILED`), `amount`
- **Review**: `id` (UUID), `productId`, `userId`, `rating` (1-5), `comment`, `createdAt`
- **Coupon**: `id` (UUID), `code` (unique), `discountType` (`PERCENTAGE`, `FIXED`), `discountValue`, `minOrderValue`, `validFrom`, `validTo`, `usageLimit`, `usedCount`
- **Wishlist**: `id` (UUID), `userId`, `productId`, `createdAt`

**Lưu ý Index**:
* Unique indexes: `product.slug`, `user.email`, `category.slug`, `variant.sku`, `coupon.code`.
* Performance indexes: `order.userId`, `orderItem.orderId`, `cartItem.cartId`, `product.categoryId`.

---

## 4. Xác Thực & Phân Quyền (Auth & Authorization)

- Đăng ký/đăng nhập bằng email + password (mật khẩu băm qua `bcrypt`).
- JWT:
  - **Access token**: thời gian sống ngắn (~15 phút), gửi qua Authorization Header `Bearer <token>`.
  - **Refresh token**: lưu trong `httpOnly` secure cookie (~7 ngày).
- Middleware:
  - `requireAuth`: Xác thực JWT hợp lệ, gắn `req.user`.
  - `requireRole('ADMIN')`: Chặn truy cập trái phép vào các endpoint quản trị.
- Rate limiting: Áp dụng cho các endpoint `/api/auth/*` chống tấn công brute-force.

---

## 5. Chuẩn Hóa Cấu Trúc API (RESTful)

Mọi API prefix bắt đầu bằng `/api/`:
```text
/api/auth        POST /register, POST /login, POST /refresh, POST /logout
/api/users       GET /me, PUT /me, GET / (admin)
/api/categories  GET /, GET /slug/:slug, GET /:id, POST / (admin), PUT /:id (admin), DELETE /:id (admin)
/api/products    GET /, GET /slug/:slug, GET /:id, POST / (admin), PUT /:id (admin), DELETE /:id (admin)
/api/cart        GET /, POST /items, PUT /items/:id, DELETE /items/:id
/api/orders      POST / (checkout), GET / (lịch sử), GET /:id, PUT /:id/status (admin)
/api/coupons     GET /, POST /validate, POST / (admin)
/api/reviews     GET /product/:id, POST /
/api/upload      POST / (upload ảnh lên Cloudinary/S3)
```

### Định dạng phản hồi chuẩn:
* **Thành công**:
  ```json
  {
    "success": true,
    "message": "Resource fetched successfully",
    "data": { ... }
  }
  ```
* **Lỗi**:
  ```json
  {
    "success": false,
    "message": "Validation failed / Resource not found",
    "error": [ ... ]
  }
  ```

---

## 6. Frontend — Các Phân Hệ Chính

- **Storefront (`web`)**:
  - Trang chủ, danh sách sản phẩm (Filter danh mục, giá, sort, search, phân trang).
  - Chi tiết sản phẩm (chọn biến thể variant: màu sắc/kích thước, thư viện ảnh).
  - Giỏ hàng (Slide-out Sheet), Checkout, Tra cứu đơn hàng.
  - Quản lý tài khoản (thông tin cá nhân, sổ địa chỉ, lịch sử đơn hàng, wishlist).
- **Admin Dashboard (`dashboard`)**:
  - Thống kê doanh thu, biểu đồ đơn hàng, khách hàng mới.
  - Quản trị Sản phẩm & Biến thể (Data table với phân trang, tìm kiếm, lọc, form tạo/sửa).
  - Quản trị Danh mục (Hỗ trợ cha-con).
  - Quản trị Đơn hàng & Cập nhật trạng thái vận chuyển.
  - Quản trị Mã giảm giá (Coupons) & Người dùng.
- **Component UI**: Tái sử dụng thư viện `shadcn/ui` (Table, Dialog, Dropdown, Sheet, Badge, Toast, Form).

---

## 7. Các Phần Dễ Bị Bỏ Sót — Bắt Buộc Triển Khai

1. **Quản lý tồn kho (Inventory & Race condition)**:
   - Áp dụng DB Transaction (`prisma.$transaction`) khi checkout: trừ stock variant, tạo order, tạo order items đồng thời.
   - Hoàn trả stock khi đơn hàng bị hủy (`CANCELLED`).
2. **State Machine Đơn hàng**:
   - Luồng trạng thái: `PENDING` $\rightarrow$ `PAID` $\rightarrow$ `SHIPPING` $\rightarrow$ `COMPLETED` (hoặc `CANCELLED`).
3. **Giỏ hàng khách vãng lai (Guest Cart)**:
   - Lưu `sessionId` vào cookie nếu chưa đăng nhập, tự động merge giỏ hàng khi user đăng nhập.
4. **Bảo mật & Headers**:
   - `helmet`, CORS whitelist cấu hình domain cụ thể của `dashboard` và `web`.

---

## 8. Lộ Trình Phát Triển (7 Milestones)

- [x] **Milestone 1: Setup Foundation**: Monorepo, PostgreSQL, Prisma Schema, Rules & Skills, Definition of Done.
- [x] **Milestone 2: Auth & User Management**: Đăng ký, đăng nhập JWT, cookie, profile, sổ địa chỉ.
- [ ] **Milestone 3: Product & Category Core**: Quản lý danh mục cha-con, sản phẩm & biến thể variant, ảnh, filter/search API.
- [ ] **Milestone 4: Cart & Checkout**: Giỏ hàng guest & user, coupon validation, atomic transaction checkout.
- [ ] **Milestone 5: Order & Payment**: Cổng thanh toán, webhook, quản lý trạng thái đơn hàng.
- [ ] **Milestone 6: Dashboard & Storefront Polish**: Kết nối UI hoàn chỉnh, review đánh giá, email thông báo.
- [ ] **Milestone 7: Testing & CI/CD**: Unit test Vitest, Integration test Supertest, Docker Compose, GitHub Actions.

---

## 9. Definition of Done (Bắt buộc cho mọi task giao Agent)

Một task chỉ được coi là hoàn thành khi:
1. **Type-Safety**: Toàn bộ code TypeScript pass `tsc --noEmit` với 0 lỗi.
2. **Validation**: Mọi endpoint API có Zod Schema kiểm tra request body / query params.
3. **API Standards**: Trả về đúng HTTP status code và định dạng `{ success, data, message, error }`.
4. **Security**: Mật khẩu luôn hash bcrypt, không hardcode credentials, đọc từ `.env`.
5. **Database**: Schema đồng bộ với PostgreSQL qua Prisma, migration được lưu trữ rõ ràng.
6. **Không để lại lỗi runtime**: Server và ứng dụng build sạch sẽ.
