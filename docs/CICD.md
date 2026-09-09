# CI/CD Plan

## Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  check:
    steps:
      - checkout
      - setup Node LTS
      - npm ci
      - npm run check          # tsc backend + dashboard + web
      - backend: prisma validate
      - npm test               # fast unit smoke

Integration PostgreSQL và Playwright là release/manual jobs, không nằm trong CI nhanh cho mọi push/PR.
```

## Deploy Targets

| Stage | Cách |
|---|---|
| Local | `npm run dev` + Postgres local / docker-compose |
| Staging | Docker Compose trên VPS hoặc Railway/Render |
| Production | Docker images; migrate `prisma migrate deploy` trước start |

## docker-compose

Services: `api`, `dashboard`, `web`, `postgres`. Dashboard chạy ở `:8081`, storefront ở `:8080`.

## Release Rules

- Không deploy nếu `tsc` fail
- Migration chạy trước app start
- Staging smoke: login admin + list products
