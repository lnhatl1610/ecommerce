# Definition of Done

Một task chỉ **Done** khi:

1. **Type-safe**: `npx tsc --noEmit` (backend) và dashboard typecheck pass, 0 lỗi.
2. **Validation**: Endpoint mới/sửa có Zod schema cho body/query cần thiết.
3. **API contract**: Status code đúng; envelope `{ success, message, data|error }`.
4. **Security**: Không hardcode secret; password luôn hash; route admin có `requireRole`.
5. **Database**: Schema đổi → migration + `prisma generate`.
6. **UX states** (FE): loading / empty / error cơ bản.
7. **Docs**: Nếu đổi API/schema → cập nhật `docs/API_SPEC.md` hoặc `DATABASE.md`.
8. **PR**: Mô tả thay đổi + bước test thủ công.

Không Done nếu chỉ “chạy được trên máy dev” mà typecheck fail hoặc lộ secret.
