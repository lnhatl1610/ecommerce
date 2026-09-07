---
name: scaffold-backend-module
description: >-
  Hướng dẫn và quy trình từng bước để tạo mới một module chuẩn trong backend (Node.js/Express/TypeScript/PostgreSQL/Prisma).
  Sử dụng skill này khi người dùng yêu cầu tạo mới một module backend, thực thể mới (như orders, carts, reviews, v.v.), hoặc mở rộng API backend.
---

# Quy Trình Tạo Mới Module Backend Chuẩn (PostgreSQL & Prisma)

Tài liệu này hướng dẫn agent và lập trình viên cách tạo một module mới trong `backend/src/modules/<feature>/` tuân thủ kiến trúc phân tầng của dự án.

---

## 1. Danh Sách File & Thao Tác

1. **Cập nhật Database Schema**: Thêm model vào `backend/prisma/schema.prisma` và chạy `npx prisma generate`.
2. **Cấu trúc 7 file trong module**:
```text
backend/src/modules/<feature>/
├── <feature>.types.ts       # 1. Interface kế thừa từ Prisma Client & Query types
├── <feature>.dto.ts         # 2. DTO cho Create / Update requests
├── <feature>.dao.ts         # 3. Data Access Object tương tác với Prisma Client
├── <feature>.repository.ts  # 4. Repository trừu tượng hóa DAO
├── <feature>.service.ts     # 5. Nghiệp vụ kinh doanh (Validation, Unique checks)
├── <feature>.controller.ts  # 6. Xử lý HTTP Request/Response (Express 5 type-safe)
└── <feature>.route.ts       # 7. Express Router và mapping URL
```

---

## 2. Các Bước Thực Hiện Chi Tiết

### Bước 1: Định nghĩa Model trong Prisma (`backend/prisma/schema.prisma`)
* Khai báo model với khóa chính UUID và quan hệ (nếu có):
  ```prisma
  model Review {
    id        String   @id @default(uuid())
    rating    Int      @default(5)
    comment   String?
    userId    String
    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    productId String
    product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@map("reviews")
  }
  ```
* Chạy lệnh sinh client:
  ```powershell
  cd backend; npx prisma generate
  ```

### Bước 2: Tạo Types & DTOs (`<feature>.types.ts` & `<feature>.dto.ts`)
* Kế thừa type từ `@prisma/client`:
  ```ts
  import type { Review as PrismaReview } from "@prisma/client";
  export interface Review extends PrismaReview {}
  ```
* Tạo `CreateReviewDTO` và `UpdateReviewDTO`.

### Bước 3: Tạo DAO & Repository
* `DAO`: Trực tiếp gọi `prisma.<model>.create()`, `findMany()`, `findUnique()`, `update()`, `delete()`.
* `Repository`: Bọc DAO, hỗ trợ dependency injection qua constructor.

### Bước 4: Tạo Service
* Kiểm tra tính hợp lệ dữ liệu (ví dụ: kiểm tra entity quan hệ có tồn tại không).
* Xử lý tạo slug tự động nếu có.

### Bước 5: Tạo Controller & Route
* Nhận request, ép kiểu `req.params.id as string`, kiểm tra input và trả về HTTP status code phù hợp (`200`, `201`, `400`, `404`, `409`, `500`).
* Đăng ký router Express.

### Bước 6: Mount Route trong `backend/src/app.ts`
* Import route với đuôi `.js` và gán vào endpoint: `app.use("/<features>", <feature>Router);`.

### Bước 7: Kiểm Tra Typecheck
* Chạy `cd backend; npx tsc --noEmit` để đảm bảo code biên dịch sạch 100%.
