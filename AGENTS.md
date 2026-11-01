# AGENTS.md — xshop admin paneli

**Tam qayda dəsti: [`GEMINI.md`](./GEMINI.md) — işə başlamazdan əvvəl oxu.** Bu fayl yalnız xülasə və iş axınıdır.
Yuxarı qovluqdaki `D:\www\xshop\AGENTS.md` **storefront** üçündür — bu layihəyə aid deyil, onu tətbiq etmə.

## Ən çox pozulan 8 qayda (GEMINI.md §1)

1. **Inline CSS yoxdur** — `style={{}}`, `<style>`, `.css` faylı, hex/px hard-code. Yalnız Tailwind class + `cn()` + `src/styles` token-ləri.
2. **İmperativ JS yoxdur** — `document.*`, `querySelector`, `addEventListener`, `dangerouslySetInnerHTML`, `window.location`, `setTimeout`-la gözləmə.
3. **Yeni qovluq icad etmə** — `utils/`, `helpers/`, `common/`, `types/`, `v2/` yox. Fayl manifesti: `GEMINI.md` §3.
4. **Spagetti yoxdur** — qat axını birstiqamətli: `routes → index.tsx → components → hooks → data`. Komponentdə `axios`/`fetch` və biznes hesablaması yox.
5. **Ortaq primitivi yenidən yazma** — `EntityDataTable`, `EntityFormDialog`, `AdminPageShell`, `PageGuard` və s. hazırdır (`GEMINI.md` §4).
6. **Hard-code mətn yoxdur** — `useTranslation('<ns>')` + `public/locales/{az,en,tr}/<ns>.json` **üçü birlikdə**, açarlar eyni.
7. **Mock service-in içində yox** — `src/mocks/<domain>.ts` + `src/mocks/index.ts` route map (`VITE_API_MOCK=1`).
8. **Yeni paket yox**, konfiq fayllarına toxunma (`package.json`, `vite.config.ts`, `tsconfig*`, `eslint.config.js`).

ESLint bunların bir hissəsini **məcbur edir**: `max-lines` (komponent 150 / hook 80 / service 120), inline CSS qadağası (`no-restricted-syntax`).
`pnpm lint` qırmızıdırsa iş bitməyib.

## İş axını (bir sessiya = bir bölüm)

1. Tapşırığı oxu: `D:\www\xshop\task\admin\<NN>-<bölüm>.md` (13 bölmə: ekran inventarı, data sxemi, siyahı, forma, endpoint, i18n, DoD, açıq suallar).
2. Ekran tipinə uyğun **referans feature**-ı tap: `D:\www\xshop\task\admin\SECTION-PROMPT.md` §1 cədvəli.
3. Həmin referans feature-ın bütün fayllarını oxu: `D:\www\1c-prielaz\admin\src\features\<ad>\**` — **nüsxə çıxarırsan, icad etmirsən**.
4. `GEMINI.md` §3 manifestindəki faylları yaz.
5. Yoxla: `npx pnpm@12 build && npx pnpm@12 lint` + `GEMINI.md` §9 grep-ləri. (`pnpm` qlobal quraşdırılmayıb — `npx pnpm@12` işlət.)
6. İzləmə: `AEC-SIDEBAR-MENU.md`-də bitən ekranları işarələ (həmin faylın başındaki leqenda).
7. 5 sətirlik hesabat: fayl sayı · build/lint nəticəsi · yeni chunk ölçüsü · yoxlanılmayan · risk.

Tapşırıq faylında cavabsız sual (§13) varsa və cavab kodun formasını dəyişirsə — **kod yazma, soruş**.

## Chat panelinə yapışdırmaq üçün (hər bölümün başında)

```
`D:/www/xshop/admin/GEMINI.md` və `AGENTS.md` qaydaları qüvvədədir.

Bölüm: 01-dashboard

1. Oxu: `D:/www/xshop/task/admin/01-dashboard.md`
2. Oxu: `D:/www/xshop/task/admin/SECTION-PROMPT.md` §1 → referans feature
3. Oxu: referans feature-ın bütün faylları `D:/www/1c-prielaz/admin/src/features/<ad>/**`
4. Qısa plan (GEMINI.md §3 manifesti), sonra faylları yaz
5. `npx pnpm@12 build && npx pnpm@12 lint` — yaşıl olana qədər özün düzəlt
6. `AEC-SIDEBAR-MENU.md`-də bitən ekranları işarələ
7. 5 sətirlik hesabat

Qeyri-müəyyənlik varsa uydurma — dayan və soruş.
```

## Layihənin cari vəziyyəti (2026-11-02)

İnfra qatı `1c-prielaz/admin`-dən köçürülüb (pilot: `task/admin/00-baseline.md` §15). Hazırdır:
auth (Bearer + sanctum axını), i18n (az/en/tr, lazy), `users`/`role`/`permission` ekranları, settings (profil/hesab/görünüş),
ortaq data-table + forma primitivləri, mock qatı, sürət defaultları. `build` + `lint` yaşıl, ilk JS 66 KB gzip (büdcə 300 KB).

**Qalan ilk iş:** panel qatı — `task/admin/00b-panels-and-roles.md` (üç nav ağacı: `/admin`, `/seller`, `/courier`).
Hazırda sidebar hələ `1c`-nin ERP menyusunu göstərir (`src/components/layout/data/sidebar-data.ts`) — o addım onu əvəz edir.
