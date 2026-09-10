# Architecture Document

## 1. System Overview

```text
┌─────────────┐   ┌─────────────┐
│  web (FE)   │   │ dashboard   │
│  Storefront │   │  Admin UI   │
└──────┬──────┘   └──────┬──────┘
       │ HTTP/JSON       │
       │ Bearer + cookie │
       └────────┬────────┘
                ▼
        ┌───────────────┐
        │ backend API   │
        │ Express + TS  │
        └───────┬───────┘
                │ Prisma
                ▼
        ┌───────────────┐
        │  PostgreSQL   │
        └───────────────┘
```

## 2. Why These Choices

| Quyết định | Lý do | Không chọn |
|---|---|---|
| **Prisma** | Migration + type-safety tốt, khớp TypeScript monorepo | Drizzle (nhẹ hơn nhưng ecosystem migration kém quen thuộc hơn team) |
| **Modular backend** (DAO → Repo → Service → Controller) | Tách concern, dễ test, skill scaffold sẵn | Fat controller / single-layer |
| **JWT access + refresh httpOnly cookie** | Access ngắn hạn; refresh không lộ XSS dễ | Session server-side only (cần sticky/redis sớm) |
| **Zod** | Validate runtime FE/BE, infer type | class-validator (couples Nest patterns) |
| **TanStack Query + Zustand** | Server state vs client state rõ | Redux (overkill) |
| **shadcn/ui + Tailwind v4** | Component sở hữu code, dễ tùy biến | MUI (nặng, style conflict) |
| **Monorepo `backend`/`dashboard`/`web`** | Độc lập deploy, match AGENTS.md hiện tại | Turborepo apps/* (có thể migrate sau) |

## 3. Request Flow

1. Client gọi `/api/*` với `Authorization: Bearer <access>` (và cookie refresh khi cần).
2. Middleware: helmet → cors → rate-limit (auth) → validate (Zod) → requireAuth / requireRole.
3. Controller → Service (business) → Repository → DAO → Prisma.
4. Response envelope: `{ success, message, data | error }`.

## 4. Auth Flow

1. Login/Register → set `storefrontRefreshToken` hoặc `dashboardRefreshToken` httpOnly cookie; trả `accessToken` + user trong body.
2. API calls dùng access token.
3. 401 → client gọi `POST /api/auth/refresh` (cookie) → access mới.
4. Logout → clear cookie.

## 5. Critical Domains (sau M2)

- **Checkout**: `prisma.$transaction` — tạo Order + OrderItems + trừ stock (+ Payment).
- **Inventory**: hoàn stock khi `CANCELLED`.
- **Guest cart**: `sessionId` cookie → merge khi login.
