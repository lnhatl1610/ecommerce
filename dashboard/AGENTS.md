# Dashboard & Frontend Coding Rules & Standards

## 1. Tech Stack & Cấu Trúc Thư Mục

Phân hệ `dashboard` được xây dựng trên nền tảng:
- **React 19** + **TypeScript**
- **Vite** (Build tool & Dev server)
- **Tailwind CSS v4** + **shadcn/ui** (@base-ui/react)
- **React Router v7**
- **Axios** (HTTP client)

### Cấu trúc thư mục theo tính năng (Feature-based structure):
```text
src/
├── assets/          # Static assets (images, icons, fonts)
├── components/      # UI components dùng chung
│   ├── ui/          # Các components từ shadcn/ui (Button, Dialog, Dropdown, Table...)
│   └── Logo.tsx     # Custom shared components
├── features/        # Phân tách logic theo domain/feature
│   ├── users/       # Ví dụ: UserPage, UserTable, UserForm, userApi.ts, types.ts
│   ├── products/    # ProductPage, ProductList, productApi.ts...
│   └── dashboard/   # Overview stats, charts...
├── layouts/         # Layout components (DashboardLayout, AuthLayout, Sidebar, Navbar)
├── lib/             # Tiện ích chung, api client (api.ts, utils.ts)
├── routes/          # Cấu hình routes tập trung (dashboardRoutes.tsx, index.tsx)
├── App.tsx          # RouterProvider & global providers
├── index.css        # Tailwind v4 import & theme variables
└── main.tsx         # Root render
```

---

## 2. Quy Chuẩn Path Alias

* Luôn sử dụng alias `@/` đại diện cho `src/` khi import:
  ```tsx
  // ĐÚNG:
  import { Button } from "@/components/ui/button";
  import api from "@/lib/api";
  import { DashboardLayout } from "@/layouts/DashboardLayout";

  // TRÁNH relative path phức tạp:
  import api from "../../../lib/api";
  ```

---

## 3. Quy Chuẩn Component & UI (Tailwind CSS v4 + shadcn)

1. **Thư viện UI**:
   - Ưu tiên tái sử dụng các component trong `@/components/ui/`.
   - Kết hợp `cn()` từ `@/lib/utils` để merge Tailwind classes động:
     ```tsx
     import { cn } from "@/lib/utils";
     <div className={cn("p-4 rounded-lg", isActive && "bg-primary text-white")} />
     ```
2. **Icons**:
   - Sử dụng icon từ `lucide-react` (ví dụ: `import { Users, ShoppingBag, Plus } from "lucide-react";`).
3. **Responsive & Mobile-First**:
   - Mọi trang dashboard cần responsive, hỗ trợ sidebar thu gọn/mở rộng trên màn hình nhỏ.

---

## 4. Quy Chuẩn Gọi API & State Management

1. **Axios Client**:
   - Luôn sử dụng client tập trung tại `@/lib/api`:
     ```ts
     import api from "@/lib/api";
     ```
2. **Phân Tách Service Layer Trong Feature**:
   - Không gọi axios trực tiếp trong component render.
   - Định nghĩa hàm API trong file `features/<feature>/api.ts` hoặc `<feature>Service.ts`:
     ```ts
     export const getUsers = async (): Promise<User[]> => {
       const response = await api.get<User[]>("/users");
       return response.data;
     };
     ```
3. **Xử Lý Loading & Error**:
   - Luôn xử lý các trạng thái: `isLoading`, `isError`, và hiển thị Skeleton / Error state thân thiện cho người dùng.

---

## 5. Quy Chuẩn Routing (React Router v7)

* Mọi route trang mới phải được khai báo trong `src/routes/dashboardRoutes.tsx`.
* Trang chi tiết hoặc thêm mới đặt nested dưới path cha (ví dụ: `/products`, `/products/new`, `/products/:id`).

