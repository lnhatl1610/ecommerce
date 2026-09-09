---
name: git-github-workflow
description: Manage Git and GitHub workflows for this ecommerce monorepo, including branch planning, Conventional Commits, focused PRs, CI checks, migration safety, and release preparation. Use when the user asks to organize Git/GitHub work, split changes into PRs, prepare commits, or review repository workflow.
---

# Git/GitHub Workflow

## Repository rules

- Treat `main` as the stable branch; never push directly to it.
- Use focused branches: `feat/<domain>-<description>`, `fix/<domain>-<description>`, `refactor/...`, `chore/...`, or `docs/...`.
- Use Conventional Commits with a useful scope.
- Do not commit secrets, `.env`, production data, `node_modules`, or build output.
- Do not rewrite migrations already applied to a shared database.

## Workflow

1. Inspect `git status`, current branch, remotes, recent commits, and the changed files.
2. Preserve existing user changes; do not run destructive reset or checkout commands.
3. Group changes by domain and dependency: backend/security, database/domain, dashboard, web, then CI/docs.
4. Create or recommend a focused branch and split commits by intent.
5. Run workspace-specific checks and the root checks required by the changed files.
6. Prepare a PR summary with scope, tests, migrations/env changes, UI evidence, and rollback notes.
7. After merge, use a SemVer tag and GitHub Release for significant milestones.

## Required checks

```powershell
npm run check
npm test
npm --workspace=dashboard run build
npm --workspace=web run build
```

For Prisma changes also run:

```powershell
npm --workspace=backend exec prisma validate
npm --workspace=backend exec prisma generate
```

## PR output format

Use this structure:

```markdown
## Summary
- ...

## Changed workspaces
- backend / dashboard / web / infrastructure

## Validation
- `command` — pass/fail

## Migration and environment changes
- None, or describe them

## UI evidence
- Screenshot link or not applicable

## Rollback
- Revert PR / release tag / migration limitation
```

Read [the repository workflow](../../../docs/git-workflow.md) for the complete team process.
