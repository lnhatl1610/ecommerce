# Backend Coding Rules & Standards

## 1. Database & ORM

Backend sử dụng cơ sở dữ liệu quan hệ **PostgreSQL** kết hợp với **Prisma ORM**.
* File cấu hình schema: `backend/prisma/schema.prisma`.
* Instance kết nối singleton: `backend/src/config/db.ts` (`import prisma from "../../config/db.js"`).
* Khi sửa đổi schema, luôn chạy:
  ```bash
  npx prisma validate
  npx prisma generate
  ```

---

## 2. Kiến Trúc & Cấu Trúc Module

Backend sử dụng mô hình **Modular Architecture**. Mỗi tính năng (domain) được gom trọn vẹn trong `src/modules/<feature_name>/`.

### Cấu trúc một module chuẩn:
```text
src/modules/<feature>/
├── <feature>.types.ts       # Type definitions, interfaces kế thừa từ Prisma Client
├── <feature>.dto.ts         # Data Transfer Objects (Create/Update request inputs)
├── <feature>.dao.ts         # Data Access Object (thao tác trực tiếp với Prisma Client)
├── <feature>.repository.ts  # Repository layer (trừu tượng hóa truy vấn, gọi DAO)
├── <feature>.service.ts     # Business logic layer (validation, auto-slug, business rules)
├── <feature>.controller.ts  # Request handling, status code, response formatting
└── <feature>.route.ts       # Express Router gắn controller endpoints
```

---

## 3. Quy Chuẩn TypeScript & Node.js ESM

1. **Bắt buộc thêm đuôi `.js` khi import local**:
   - Do backend sử dụng ES Modules (`"type": "module"`), mọi import relative phải có đuôi `.js`:
   ```ts
   // ĐÚNG:
   import { UserService } from "./user.service.js";
   import type { User } from "./user.types.js";

   // SAI (gây lỗi runtime ModuleNotFound):
   import { UserService } from "./user.service";
   ```
2. **Strict Typing & Prisma Types**:
   - Tận dụng types do Prisma sinh ra: `import type { User as PrismaUser } from "@prisma/client";`.
   - Sử dụng `type` keyword khi import kiểu: `import type { Request, Response } from "express";`.
   - Tuyệt đối không dùng kiểu `any`.

---

## 4. Quy Chuẩn Controller & Service

1. **Dependency Injection**:
   - Service và Controller hỗ trợ inject dependency qua constructor để dễ viết unit test:
   ```ts
   export class UserController {
     private userService: UserService;
     constructor(userService?: UserService) {
       this.userService = userService ?? new UserService();
     }
   }
   ```
2. **Arrow functions cho Controller Methods**:
   - Định nghĩa method dạng arrow function `createUser = async (req: Request, res: Response) => { ... }` để tránh mất context `this` khi truyền vào Express router.
3. **Express 5 Param Typing**:
   - Với Express 5, `req.params.id` có kiểu `string | string[]`. Luôn cast rõ ràng: `const id = req.params.id as string;`.
4. **HTTP Status Codes**:
   - `200 OK`: Truy vấn hoặc cập nhật thành công.
   - `201 Created`: Tạo mới resource thành công.
   - `400 Bad Request`: Thiếu tham số hoặc dữ liệu không hợp lệ.
   - `401 Unauthorized`: Chưa đăng nhập / thiếu token.
   - `403 Forbidden`: Không có quyền truy cập.
   - `404 Not Found`: Không tìm thấy resource.
   - `409 Conflict`: Trùng lặp dữ liệu unique (ví dụ: email, slug, sku).
   - `500 Internal Server Error`: Lỗi máy chủ chưa xử lý.

---

## 5. Quy Chuẩn Bảo Mật & Response

1. **Ẩn thông tin nhạy cảm**: Không bao giờ trả về trường `password` trong response của User API (dùng hàm sanitize trước khi response).
2. **Băm mật khẩu**: Luôn hash mật khẩu bằng `bcrypt` trước khi lưu vào database (cả lúc tạo mới lẫn khi cập nhật mật khẩu).
