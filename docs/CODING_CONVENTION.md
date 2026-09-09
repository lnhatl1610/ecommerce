# Coding Convention

## Language & Style

- TypeScript **strict**, không dùng `any`.
- Tiếng Anh cho identifier / schema; comment nghiệp vụ EN hoặc VI rõ ràng.
- Backend ESM: mọi relative import kết thúc `.js`.
- Dashboard: alias `@/` → `src/`.

## Lint / Format

- Backend: `npx tsc --noEmit`
- Dashboard: `npm run build` / `tsc -b` + ESLint
- Root: `npm run check`

## Git — Conventional Commits

```text
feat(backend): add address module
fix(dashboard): handle expired access token refresh
docs: add API_SPEC
chore(backend): add helmet and rate-limit
```

## Branch Strategy

| Branch | Mục đích |
|---|---|
| `main` | Stable |
| `feat/<scope>-<short>` | Feature |
| `fix/<scope>-<short>` | Bugfix |

PR nhỏ theo milestone/task; mô tả thay đổi + cách test thủ công.

## Module Layering (Backend)

Controller không gọi Prisma trực tiếp. Service chứa business rules. DAO là nơi duy nhất gọi Prisma Client.
