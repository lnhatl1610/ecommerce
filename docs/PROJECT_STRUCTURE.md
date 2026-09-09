# Project Structure

Cấu trúc thực tế của monorepo (không dùng `apps/` — giữ `backend/`, `dashboard/`, `web/`).

```text
ecommerce/
├── backend/
│   ├── prisma/schema.prisma
│   ├── prisma/migrations/
│   ├── src/
│   │   ├── config/          # db, env
│   │   ├── middlewares/     # auth, validate, rate-limit
│   │   ├── lib/             # response helpers, cookies
│   │   ├── types/
│   │   ├── modules/<feature>/
│   │   │   ├── <feature>.types.ts
│   │   │   ├── <feature>.dto.ts
│   │   │   ├── <feature>.schema.ts   # Zod (hoặc *.dto.ts nếu gộp)
│   │   │   ├── <feature>.dao.ts
│   │   │   ├── <feature>.repository.ts
│   │   │   ├── <feature>.service.ts
│   │   │   ├── <feature>.controller.ts
│   │   │   └── <feature>.route.ts
│   │   ├── app.ts
│   │   └── server.ts
│   └── tests/
├── dashboard/src/
│   ├── components/ui/
│   ├── features/<feature>/
│   ├── layouts/
│   ├── lib/
│   ├── routes/
│   └── stores/
├── web/                     # Storefront (scaffold sau)
├── docs/                    # Planning artifacts
├── .agents/skills/
├── AGENTS.md
├── PLANNING.md
└── package.json             # npm workspaces
```

## Naming

| Loại | Quy ước |
|---|---|
| Thư mục | `kebab-case` hoặc `camelCase` |
| React component | `PascalCase.tsx` |
| Backend module files | `feature.route.ts`, `feature.service.ts`, … |
| Biến/hàm | `camelCase` |
| Types/Interfaces | `PascalCase` |
| Constants | `UPPER_SNAKE_CASE` |

Import backend local **bắt buộc** đuôi `.js` (ESM). Dashboard dùng alias `@/`.
