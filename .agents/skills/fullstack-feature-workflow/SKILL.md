---
name: fullstack-feature-workflow
description: >-
  Quy trình phát triển tính năng Full-stack từ A đến Z trong dự án E-commerce, kết nối từ Database PostgreSQL (Prisma), API Backend Express đến Giao diện Dashboard/Web.
  Sử dụng skill này khi người dùng yêu cầu xây dựng một tính năng hoàn chỉnh từ backend đến frontend (ví dụ: quản lý sản phẩm, đơn hàng, người dùng, báo cáo doanh thu).
---

# Quy Trình Phát Triển Tính Năng Full-Stack Chuẩn

Tài liệu này là quy trình chuẩn giúp phát triển một tính năng hoàn chỉnh, bảo đảm đồng bộ kiểu dữ liệu, bảo mật và trải nghiệm người dùng xuyên suốt toàn bộ hệ thống.

---

## 5 Giai Đoạn Thực Hiện

```text
[1. Prisma Model & Schema] ──> [2. Backend Module & API] ──> [3. Frontend Service] ──> [4. UI Pages] ──> [5. Verification]
   (PostgreSQL & Migrations)      (DAO, Service, Controller)   (Axios & Types)           (Views & Tables)    (Typecheck & Run)
```

---

### Giai Đoạn 1: Thiết Kế Schema & Sinh Prisma Client
1. Mở `backend/prisma/schema.prisma`, thêm/sửa model và các quan hệ (foreign keys, enums).
2. Chạy `npx prisma validate` và `npx prisma generate`.
3. Nếu chạy migration tới DB: `npx prisma migrate dev --name <migration_name>`.

---

### Giai Đoạn 2: Xây Dựng Backend Module
1. Kích hoạt skill `scaffold-backend-module` để tạo module mới trong `backend/src/modules/<feature>/`.
2. Hoàn thiện DAO, Repository, Service (chứa business logic, validation, unique checks).
3. Viết Controller và Route Express, mount vào `backend/src/app.ts`.
4. Chạy typecheck: `cd backend; npx tsc --noEmit`.

---

### Giai Đoạn 3: Xây Dựng API Service Layer Trên Frontend (Dashboard / Web)
1. Tạo thư mục tính năng: `dashboard/src/features/<feature>/`.
2. Tạo file kiểu dữ liệu `types.ts` đồng bộ với interface từ backend:
   ```ts
   export interface Product {
     id: string;
     name: string;
     slug: string;
     price: number;
     stock: number;
     images: string[];
     categoryId: string;
     createdAt: string;
   }
   ```
3. Tạo file `api.ts` sử dụng `@/lib/api`:
   ```ts
   import api from "@/lib/api";
   import type { Product } from "./types";

   export const getProducts = async (): Promise<{ items: Product[]; total: number }> => {
     const res = await api.get("/products");
     return res.data;
   };
   ```

---

### Giai Đoạn 4: Xây Dựng Giao Diện (UI Page & Components)
1. Tạo trang chính trong `dashboard/src/features/<feature>/<Feature>Page.tsx`.
2. Sử dụng các component UI từ `@/components/ui/` (dùng skill `add-shadcn-component` nếu cần thêm component mới).
3. Đảm bảo có đủ các trạng thái hiển thị:
   - **Loading**: Skeleton hoặc Spinner.
   - **Empty state**: Khi chưa có dữ liệu nào.
   - **Error state**: Hiển thị thông báo lỗi khi API thất bại kèm nút thử lại.
4. Export trang thông qua `dashboard/src/features/<feature>/index.ts`.
5. Đăng ký route trong `dashboard/src/routes/dashboardRoutes.tsx` và menu navigation.

---

### Giai Đoạn 5: Kiểm Tra & Bàn Giao
1. Chạy typecheck ở cả backend và dashboard:
   - `npm run check` từ thư mục gốc
2. Đảm bảo toàn bộ dự án biên dịch thành công 100% không có lỗi.
