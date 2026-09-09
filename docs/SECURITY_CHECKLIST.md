# Security Checklist

## AuthN / AuthZ

- [x] Password bcrypt (cost ≥ 10)
- [x] Access JWT ngắn (~15m) + refresh httpOnly cookie (~7d)
- [x] `requireAuth` / `requireRole` trên route nhạy cảm
- [ ] Refresh token rotation / denylist (cải tiến sau)
- [ ] OAuth Google (optional)

## Input & Output

- [x] Zod validate body/query
- [x] Không trả `password` trong response
- [ ] Sanitize HTML trong review/comment khi có

## HTTP Hardening

- [x] `helmet`
- [x] CORS whitelist + `credentials: true`
- [x] Rate limit `/api/auth/*`
- [x] Admin mutation routes gated by `requireRole('ADMIN')`
- [ ] CSRF strategy nếu mở rộng cookie cho state-changing ngoài Bearer pattern

## OWASP Top 10 (tóm tắt)

| Rủi ro | Biện pháp |
|---|---|
| Injection | Prisma parameterized |
| Broken auth | JWT + rate limit + bcrypt |
| Sensitive data | No password in JSON; HTTPS prod |
| Access control | Role middleware |
| Misconfig | `.env.example` only; helmet |
| SSRF / upload | Whitelist MIME + Cloudinary (M6) |

## Payments (M5)

- Verify webhook signature từ cổng thanh toán
- Idempotent xử lý callback
