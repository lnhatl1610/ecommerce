# Environment & Config

## Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db"
PORT=3000
NODE_ENV=development

JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh

CORS_ORIGINS=http://localhost:5173,http://localhost:5174
COOKIE_SECURE=false
```

Copy từ `backend/.env.example`. **Không commit** `.env`.

## Dashboard (`dashboard/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

## Environments

| Env | DB | Cookie secure | CORS |
|---|---|---|---|
| development | local Postgres | false | localhost Vite ports |
| staging | managed Postgres | true | staging domains |
| production | managed Postgres | true | production web + dashboard only |

## Secrets

- JWT secrets ≥ 32 random bytes mỗi môi trường.
- Production secrets qua CI/hosting secret store (GitHub Actions secrets, không hardcode).
- Cloudinary/S3/Payment keys chỉ khi module tương ứng được bật.
