---
name: auto-task-runner
description: "Autonomous task execution and continuation runner for the xShop platform. Scans task/admin/README.md, identifies next pending tasks, crafts task specifications following SECTION-PROMPT.md and AEC references, implements full frontend features (types, services, mocks, components, routes, sidebar, i18n), validates with pnpm build and pnpm lint, marks checklist items, and continuously proceeds to the next milestone without unnecessary pauses."
---

# xShop Autonomous Task Runner Skill

## 1. Overview & Operational Directive

This skill defines the continuous execution loop for developing and completing all feature sections in the `xShop` Admin/Seller/Courier panel without stopping prematurely.

When invoked or given the directive to continue (`davam et`), the agent MUST NOT wait for intermediate confirmations on standard subtasks. It iterates sequentially through the roadmap until the target milestone/phase is complete.

---

## 2. The Continuous Execution Loop (Step-by-Step)

```
[Scan Roadmap] ──► [Task Spec Check/Create] ──► [Inspect AEC Ref]
       ▲                                                 │
       │                                                 ▼
[Update Checklist & Loop] ◄── [pnpm build & lint] ◄── [Implement Feature]
```

### Step 1: Scan Roadmap & Identify Next Task
1. Read `task/admin/README.md` and `AEC-SIDEBAR-MENU.md`.
2. Locate the first incomplete section in the active phase (e.g. Faza B: `05-customers`, `06-sellers`, `07-promotions`, etc.).
3. If all sections in the active phase are marked `done`, summarize and advance to the next phase.

### Step 2: Task Specification (`NN-<name>.md`)
If the specification file `task/admin/NN-<name>.md` does not exist:
1. Consult `task/admin/SECTION-PROMPT.md` and `AEC-SIDEBAR-MENU.md`.
2. Inspect the corresponding AEC Blade templates in `D:\www\aec\resources\views\backend\...`.
3. Create `task/admin/NN-<name>.md` with:
   - Screen inventory (routes, permissions, panels)
   - File map under `src/features/<domain>/`
   - Data schema (Zod/TS)
   - Acceptance criteria

### Step 3: Backend Mock & API Layer
1. **Types**: Create `src/features/<domain>/data/<domain>.type.ts`.
2. **Service**: Create `src/features/<domain>/data/<domain>.service.ts` using `requestInstanceClient`.
3. **Hooks**: Create `src/features/<domain>/hooks/use<Domain>.ts` with TanStack Query.
4. **Mocks**: Create `src/mocks/<domain>.ts` with rich, realistic fixtures.
5. **Route Interceptor**: Wire mock endpoints into `src/mocks/index.ts`.

### Step 4: UI Components & Screens
Follow strict file limits and guidelines:
- **Components**: Max 150 lines per file.
- **Hooks**: Max 80 lines per file.
- **Services**: Max 120 lines per file.
- **Styling**: Strictly 0 inline styles (`style={{}}`). Tailwind CSS only.
- **Types**: Strictly 0 `any` / `@ts-ignore`.
- Create list view, filter bars, status badges, action dialogs/modals, and detail pages.

### Step 5: Routes & Navigation
1. Create TanStack Router files in `src/routes/_authenticated/admin/<domain>/...`.
2. Update `src/components/layout/data/sidebar-data.admin.ts` under the correct nav group with collapsible submenus and lucide icons.

### Step 6: Localization (i18n)
1. Create `public/locales/{az,en,tr}/<domain>.json` with identical key sets.
2. Add navigation labels in `public/locales/{az,en,tr}/nav.json`.

### Step 7: Verification & DoD
Run and ensure 0 errors:
```powershell
powershell -Command "cd D:\www\xshop\admin; npx pnpm@12 build; npx pnpm@12 lint"
```
If errors occur, fix them immediately.

### Step 8: Update Checklists & Advance
1. Mark `task/admin/README.md` status as `done`.
2. Mark `AEC-SIDEBAR-MENU.md` items with `✅`.
3. **Continuous Advance**: Immediately transition to the next pending task in `task/admin/README.md` without halting the run loop.

---

## 3. Brand & Quality Invariants

- **Application Name**: Strictly **`xShop`** (never AEC or Prielaz).
- **Design System**: shadcn/ui + Tailwind CSS + Lucide icons.
- **Currency**: `₼` (AZN) default with multi-currency readiness.
- **Performance**: Lazy routes, server-side pagination/filtering contracts.
