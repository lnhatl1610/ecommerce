# API Specification

Base URL: `/api`  
Envelope success: `{ success: true, message, data }`  
Envelope error: `{ success: false, message, error }`

## Auth — `/api/auth`

| Method | Path | Auth | Body / Notes |
|---|---|---|---|
| POST | `/register` | Public | `{ name, email, password, phone? }` → user + accessToken; set refresh cookie |
| POST | `/login` | Public | `{ email, password }` → same; rate-limited |
| POST | `/refresh` | Cookie | Đọc `storefrontRefreshToken` hoặc `dashboardRefreshToken` theo `X-Client-App` → `{ accessToken }` |
| POST | `/logout` | Public | Clear refresh cookie |

## Users — `/api/users`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/me` | requireAuth | Profile hiện tại |
| PUT | `/me` | requireAuth | Update profile (không đổi role) |
| GET | `/` | ADMIN/STAFF | Danh sách |
| POST | `/` | ADMIN | Tạo user |
| GET | `/:id` | ADMIN/STAFF | Chi tiết |
| PUT | `/:id` | ADMIN | Cập nhật (có thể đổi role) |
| DELETE | `/:id` | ADMIN | Xóa |

## Addresses — `/api/addresses`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/` | requireAuth | Addresses của user hiện tại |
| POST | `/` | requireAuth | Tạo mới; nếu `isDefault` → unset các address khác |
| PUT | `/:id` | requireAuth | Chỉ owner |
| DELETE | `/:id` | requireAuth | Chỉ owner |

## Categories — `/api/categories`

| Method | Path | Auth |
|---|---|---|
| GET | `/`, `/slug/:slug`, `/:id` | Public |
| POST `/`, PUT `/:id`, DELETE `/:id` | ADMIN |

## Products — `/api/products`

| Method | Path | Auth |
|---|---|---|
| GET | `/`, `/slug/:slug`, `/:id` | Public |
| POST `/`, PUT `/:id`, DELETE `/:id` | ADMIN |

## Cart — `/api/cart`

- `GET /`, `POST /items`, `PUT /items/:id`, `DELETE /items/:id` support authenticated and guest carts.
- `POST /merge` merges the guest cookie cart after login and removes the source cart atomically.

## Orders, coupons and payment

- `POST /api/orders` performs checkout and stock decrement atomically; accepts `paymentMethod` and optional `couponCode`.
- `GET /api/orders`, `GET /api/orders/:id`; admin/staff can list all orders.
- `PUT /api/orders/:id/status` enforces the order state machine and restores stock on cancellation.
- `/api/coupons` provides admin/staff CRUD.
- `POST /api/payments/webhook/:provider` verifies an HMAC-SHA256 signature before updating payment/order state.

## Reviews, wishlist and upload

- `GET /api/reviews/product/:productId`; authenticated verified buyers can create/update/delete reviews.
- `/api/wishlist` provides authenticated list/add/remove operations.
- `POST /api/upload/signature` returns an authenticated Cloudinary direct-upload signature for admin/staff.

## Password recovery

- `POST /api/auth/forgot-password` creates a hashed, single-use, 30-minute reset token.
- `POST /api/auth/reset-password` consumes the token and hashes the new password.

## HTTP Status

| Code | Khi nào |
|---|---|
| 200 | OK / update |
| 201 | Created |
| 400 | Validation |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict (email, slug, sku) |
| 429 | Rate limited |
| 500 | Server error |
