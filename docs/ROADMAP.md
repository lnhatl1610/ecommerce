# Task Breakdown / Roadmap

Chi tiết khớp `PLANNING.md` §8.

| # | Milestone | Deliverables | Status |
|---|---|---|---|
| 1 | Setup Foundation | Monorepo, Prisma schema, AGENTS/skills, DoD | Done |
| 2 | Auth & User | JWT cookie, rate limit, `/me`, Address CRUD, dashboard login | Done |
| 3 | Product & Category | Variants, images, filter/search, dashboard forms | MVP Done |
| 4 | Cart & Checkout | Guest cart, merge, coupon, atomic checkout | Done |
| 5 | Order & Payment | State machine, COD + signed gateway webhook | Done |
| 6 | Polish | Storefront UI, review, wishlist, email, signed upload | MVP Done |
| 7 | Testing & CI/CD | Unit, Supertest/Vitest integration, Playwright, Docker, Actions | Done |

## External configuration before production

- Configure a real PostgreSQL database and run `prisma migrate deploy`.
- Set Cloudinary, Resend and payment-provider secrets in the deployment environment.
- Provider-specific VNPay/Momo/Stripe checkout-session creation remains an adapter task; the signed webhook ingestion and payment state update are implemented.
- Redis, advanced search and OAuth remain optional scale enhancements from the PRD, not MVP blockers.

## Agent task sizing

Mỗi task agent nên:
1. Một module hoặc một vertical slice nhỏ
2. Có acceptance theo `docs/DEFINITION_OF_DONE.md`
3. Có manual test steps trong PR
