# Product Requirements Document (PRD)

## 1. Vision

Xây dựng hệ thống thương mại điện tử full-stack cho thị trường Việt Nam: storefront mua sắm (`web`), admin dashboard (`dashboard`), và RESTful API (`backend`) trên PostgreSQL.

## 2. Target Users

| Persona | Nhu cầu chính |
|---|---|
| **Customer** | Duyệt/tìm sản phẩm, giỏ hàng, checkout, theo dõi đơn, đánh giá, wishlist |
| **Admin / Staff** | Quản lý sản phẩm, danh mục, đơn hàng, user, coupon, thống kê doanh thu |
| **Guest** | Duyệt sản phẩm, dùng guest cart; merge cart khi đăng nhập |

## 3. In Scope (MVP → Full)

### MVP (Milestone 1–5)
- Auth email/password (JWT access + refresh cookie)
- Quản lý User profile & Address book
- Category (cây cha–con), Product + Variant + Image
- Cart (user + guest), Checkout atomic, Coupon validate
- Order state machine + Payment (COD trước; VNPay/Momo sau)
- Admin CRUD cơ bản + thống kê doanh thu đơn giản

### Later (Milestone 6–7)
- Review, email notification, search nâng cao
- Upload ảnh Cloudinary/S3
- Testing đầy đủ + Docker + GitHub Actions

## 4. Out of Scope (v1)

- Multi-vendor marketplace
- Live chat / realtime notification phức tạp
- Native mobile app
- Multi-warehouse inventory phân tán

## 5. Success Metrics

- Checkout hoàn tất trong < 3 phút trên mobile
- API p95 < 300ms cho list products (không cache)
- 0 secret hardcode trong repo
- Mọi mutation API có Zod validation
