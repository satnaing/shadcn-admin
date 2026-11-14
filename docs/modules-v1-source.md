# Modules screen — v1 source

v1 («Funksiyaların Aktivləşdirilməsi», `D:\www\allixwork\admin`):
- Component: `src/features/settings/components/features-activation-page.tsx` (12 hard-coded cards, local `useState`, «Yadda saxla» only toasts — no API).
- Route: `src/routes/_authenticated/admin/settings/features.tsx` (`/admin/settings/features`), re-exported through `@/features/settings`.
- Model copied as-is: card grid (`grid-cols-1 md:2 lg:3`), icon tile + title + `Switch`, description, status line `● Aktiv / ○ Deaktiv`, header with title/subtitle and a «Yadda saxla» button.

admin2 (`/admin/modules`, `src/features/modules`) keeps that layout and adds: `required` lock, `requires[]` dependency plan (auto-enable dependencies / warn on dependants — pure logic in `data/module-deps.ts`), search + Active/Inactive/Not installed filter, batch save (`POST /admin/modules/batch`), «Upload module» (.zip) dialog with validation steps, per-card update and delete.

v1's 12 cards were feature flags (multivendor, wallet, coupons, KYC, reviews …); admin2 shows real modules (`module.json`). Whether those system cards are modules or flags is open question Q-M3 — fixtures here treat them as modules.
