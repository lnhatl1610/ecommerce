# Git và GitHub Workflow

Tài liệu này quy định cách làm việc với Git/GitHub cho monorepo E-commerce.

## Nguyên tắc chính

- `main` là branch ổn định và chỉ nhận thay đổi qua Pull Request.
- Mỗi thay đổi phải nằm trên branch riêng.
- Commit phải nhỏ, có mục đích rõ ràng và dùng Conventional Commits.
- CI phải pass trước khi merge.
- Không commit secrets hoặc dữ liệu môi trường.

## Branch

```text
feat/<domain>-<description>
fix/<domain>-<description>
refactor/<domain>-<description>
chore/<domain>-<description>
docs/<domain>-<description>
```

Ví dụ:

```text
feat/account-overview
fix/auth-refresh-cookie-isolation
chore/ci-workspace-checks
```

Tạo branch từ `main` mới nhất:

```powershell
git switch main
git pull --ff-only origin main
git switch -c feat/<domain>-<description>
```

## Commit

Format:

```text
<type>(<scope>): <short description>
```

Các type được dùng:

- `feat`: tính năng mới
- `fix`: sửa lỗi
- `refactor`: thay đổi cấu trúc không đổi hành vi
- `test`: thêm hoặc sửa test
- `chore`: tooling, dependency, CI
- `docs`: tài liệu

Ví dụ:

```text
feat(backend): add account overview endpoint
fix(auth): isolate dashboard and storefront refresh cookies
chore(ci): validate all workspaces
```

## Kiểm tra trước khi commit/PR

Từ thư mục root:

```powershell
npm ci
npm run check
npm test
npm --workspace=dashboard run build
npm --workspace=web run build
```

Khi thay đổi Prisma:

```powershell
npm --workspace=backend exec prisma validate
npm --workspace=backend exec prisma generate
```

Khi chỉ thay đổi một workspace, vẫn chạy check workspace đó và các integration check liên quan.

## Pull Request

PR cần có:

1. Mục tiêu thay đổi.
2. Các workspace/API/schema bị ảnh hưởng.
3. Migration hoặc biến môi trường mới.
4. Lệnh kiểm thử đã chạy và kết quả.
5. Screenshot/video nếu thay đổi dashboard hoặc web.
6. Breaking changes và hướng rollback nếu có.

PR không nên chứa:

- File `.env` hoặc secrets.
- `node_modules`, build output hoặc log cá nhân.
- Thay đổi không liên quan.
- Migration sửa lại sau khi đã chạy trên database dùng chung.

## Merge và release

- Bật branch protection cho `main`.
- Bắt buộc PR, CI pass và branch cập nhật với `main`.
- Dùng Squash merge để lịch sử `main` dễ đọc.
- Sau feature/release lớn, tạo tag SemVer như `v1.1.0` và GitHub Release.
- Khi rollback, ưu tiên revert PR hoặc quay về release tag trước đó; không reset lịch sử `main` dùng chung.

## Tách thay đổi hiện tại

Các thay đổi lớn đang có nên được tách thành các PR theo thứ tự:

1. Backend auth/security và config.
2. Prisma migrations và backend domain modules.
3. Dashboard admin.
4. Storefront web.
5. CI, Docker và documentation.

Giữ nguyên thay đổi chưa phân loại; dùng `git diff` và `git add -p` để chọn từng nhóm, không dùng destructive reset.
