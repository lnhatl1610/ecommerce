# Testing Strategy

## Nguyên tắc chạy test

Mục tiêu của vòng kiểm tra mặc định là nhanh, ít tốn tài nguyên và vẫn bắt được lỗi compile/regression phổ biến. Không chạy database service hoặc tải browser ở mỗi thay đổi nhỏ.

## Hồ sơ kiểm tra

| Profile | Lệnh | Khi chạy |
|---|---|---|
| Fast (mặc định) | `npm run check && npm test` | Mỗi task/commit |
| Feature | `npm --workspace=backend run test:integration` | Khi sửa API, DB, auth, cart, order, payment |
| Release | `npm run test:e2e` | Trước release hoặc khi sửa storefront flow |

## Stack

| Tầng | Tool | Phạm vi |
|---|---|---|
| Unit | Vitest | Service: giá, coupon, stock, auth sanitize |
| Integration | Supertest + Vitest | API theo module (`/api/auth`, `/api/orders`, …) |
| E2E | Playwright | Register → cart → checkout → order history |
| Race | Integration + concurrent requests | Stock sắp hết khi nhiều checkout |

## Coverage Targets

- MVP không ép coverage toàn repo để tránh test hình thức.
- Critical business logic (stock, coupon, auth): mục tiêu ≥ 70% khi module ổn định.
- Auth/checkout integration và E2E chỉ bắt buộc trong release profile.

## Conventions

- Test DB riêng (`DATABASE_URL` test) hoặc transaction rollback.
- Không phụ thuộc thứ tự test.
- Fixtures/seed dùng Prisma seed script.

## Hiện trạng

- `npm test`: unit smoke tests cho pricing và order transitions (nhanh, không cần DB).
- `npm --workspace=backend run test:integration`: test API/race-condition, opt-in khi có test database.
- `npm run test:e2e`: Playwright luồng đăng ký → giỏ hàng → checkout, opt-in trước release.
- CI mặc định chỉ chạy fast profile; integration/release chạy qua workflow/manual release gate riêng.
