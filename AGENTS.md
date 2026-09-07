# E-Commerce Project Guidelines & Agent Rules

Dự án này là hệ thống thương mại điện tử (E-commerce) full-stack được tổ chức dưới dạng monorepo gồm 3 phân hệ chính:
- `backend`: RESTful API server (Node.js, Express, TypeScript, PostgreSQL, Prisma ORM).
- `dashboard`: Trang quản trị nội bộ (React 19, Vite, Tailwind CSS v4, shadcn/ui).
- `web`: Trang mua sắm cho người dùng cuối (Storefront).

---

## 1. Nguyên Tắc Cốt Lõi (Core Principles)

1. **TypeScript Strictness**:
   - Luôn sử dụng TypeScript có kiểu dữ liệu rõ ràng. Tránh tuyệt đối kiểu `any`.
   - Định nghĩa DTOs, Interfaces và Types trong các thư mục riêng hoặc file types chuyên trách.
2. **Kiến Trúc Tách Biệt (Separation of Concerns)**:
   - Giữ mã nguồn giữa các phân hệ độc lập. Không import chéo relative path vượt ra ngoài phạm vi thư mục của phân hệ (ví dụ: dashboard không import trực tiếp từ backend).
3. **Tính Nhất Quán Trong Mã Nguồn**:
   - Sử dụng tiếng Anh cho tên biến, hàm, class, file và database schema.
   - Thảo luận, comment giải thích nghiệp vụ bằng tiếng Việt hoặc tiếng Anh rõ ràng.
4. **Bảo Toàn Mã Nguồn & Kiểm Tra Trước Khi Hoàn Tất**:
   - Sau khi tạo hoặc chỉnh sửa code, luôn chạy typecheck (`npx tsc --noEmit`) hoặc lint để đảm bảo không phát sinh lỗi biên dịch.

---

## 2. Quy Ước Đặt Tên & Cấu Trúc File

* **Thư mục & File**:
  * Tên thư mục: `kebab-case` hoặc `camelCase` (ví dụ: `modules/order-items/` hoặc `components/ui/`).
  * React Component: `PascalCase.tsx` (ví dụ: `ProductCard.tsx`, `DashboardLayout.tsx`).
  * Backend module files: `feature.route.ts`, `feature.controller.ts`, `feature.service.ts`, `feature.model.ts`.
* **Biến và Hàm**: `camelCase` (ví dụ: `fetchUserData`, `totalPrice`).
* **Interfaces & Types**: `PascalCase` (ví dụ: `IUser`, `CreateProductDTO`, `OrderStatus`).
* **Hằng số**: `UPPER_SNAKE_CASE` (ví dụ: `DEFAULT_PAGE_SIZE`, `JWT_SECRET`).

---

## 3. Quy Chuẩn Git & Commits

Tuân thủ chuẩn **Conventional Commits**:
* `feat`: Thêm tính năng mới (ví dụ: `feat(backend): add product search api`).
* `fix`: Sửa lỗi (ví dụ: `fix(dashboard): resolve button alignment in dark mode`).
* `refactor`: Tái cấu trúc mã mà không đổi hành vi.
* `chore`: Cập nhật build scripts, dependencies hoặc cấu hình.
* `docs`: Cập nhật tài liệu hoặc rules.

---

## 4. Phân Hệ Chi Tiết

Vui lòng đọc các file quy chuẩn chuyên biệt khi làm việc trong từng thư mục:
* Backend: Tham khảo [backend/AGENTS.md](./backend/AGENTS.md)
* Dashboard: Tham khảo [dashboard/AGENTS.md](./dashboard/AGENTS.md)

