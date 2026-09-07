---
name: add-shadcn-component
description: >-
  Hướng dẫn thêm, tùy biến và kiểm tra các component từ thư viện shadcn/ui vào dashboard hoặc web frontend.
  Sử dụng skill này khi người dùng yêu cầu thêm UI component mới (như button, dialog, table, card, form, dropdown, badge, sheet, tabs, v.v.).
---

# Hướng Dẫn Thêm & Sử Dụng Component shadcn/ui

Dự án sử dụng **shadcn/ui** kết hợp với **Tailwind CSS v4** và `@base-ui/react`. Tài liệu này chuẩn hóa quy trình thêm và tích hợp components vào giao diện.

---

## 1. Cấu Hình Dự Án

* File cấu hình: `dashboard/components.json`
* Thư mục đích của components: `dashboard/src/components/ui/`
* Tiện ích nối class: `dashboard/src/lib/utils.ts` (hàm `cn`)

---

## 2. Quy Trình Thêm Component Mới

### Bước 1: Chạy lệnh thêm component
Di chuyển vào thư mục `dashboard` và sử dụng công cụ CLI của shadcn:
```powershell
cd dashboard
npx shadcn@latest add <component-name>
```
*Ví dụ*:
```powershell
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add badge
```

### Bước 2: Kiểm tra file được tạo
Kiểm tra trong `dashboard/src/components/ui/<component-name>.tsx`.
Đảm bảo:
1. Đường dẫn import `@/lib/utils` chính xác.
2. Không bị lỗi xung đột phiên bản React 19.

### Bước 3: Sử Dụng Component Trong Feature
Import từ alias `@/components/ui/<name>`:
```tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
```

### Bước 4: Kiểm Tra Biên Dịch & Giao Diện
Chạy lệnh kiểm tra TypeScript:
```powershell
cd dashboard; npx tsc --noEmit
```
Đảm bảo component render tốt trên cả chế độ responsive (mobile và desktop).

