# GEMINI.md — xshop admin paneli: məcburi iş qaydaları

Bu fayl **hər sessiyada qüvvədədir**. Burada yazılanlar istəyə görə dəyişmir.
Sən bu layihədə **yeni memarlıq icad etmirsən** — mövcud konvensiyanı nüsxə çıxarırsan.

**Layihə:** multivendor eCommerce admin + satıcı + kuryer paneli. Bir app, üç nav ağacı (`/admin`, `/seller`, `/courier`).
**Stack:** React 19 · TypeScript · Vite · Tailwind 4 · shadcn/ui · TanStack Router + Query + Table · react-hook-form + zod · axios · zustand · i18next · sonner · lucide-react · recharts · date-fns
**Konvensiya mənbəyi (işlək layihə, oxu və nüsxə çıxar):** `D:\www\1c-prielaz\admin\src`
**Plan sənədləri:** `D:\www\xshop\task\admin\` — bölüm faylları (`NN-*.md`), `README.md` (qərarlar E1–E24), `00-baseline.md` (§14 sürət, §15 pilot)

---

## 1. QADAĞALAR (pozulan kod qəbul edilmir)

| # | Qadağa | Əvəzinə |
|---|---|---|
| 1 | **Inline CSS** — `style={{...}}`, `<style>`, `styled`, komponentə xas `.css` faylı | Tailwind utility class-ları + `cn()` (`@/lib/utils`) + `src/styles/**` token-ləri |
| 2 | **Inline / imperativ JS** — `<script>`, `dangerouslySetInnerHTML`, `document.querySelector`, `window.addEventListener` (komponent içində), əl ilə DOM dəyişməsi, jQuery üslubu | React state + mövcud hook-lar; lazımdırsa `useRef` |
| 3 | **Yeni qovluq icad etmək** — `helpers/`, `utils/`, `common/`, `types/`, `api/`, `services/` adlı yeni qovluqlar | §3-dəki **dəqiq** fayl manifesti; ortaq kod `@/shared/**`-dadır |
| 4 | **Spagetti komponent** — bir faylda data sorğusu + biznes məntiqi + render | `data/` (tip, sxem, service) · `hooks/` (sorğu, mutasiya) · `components/` (yalnız render) |
| 5 | **Komponent içində `axios` / `fetch`** | `data/<domain>.service.ts` → `hooks/use<Domain>s.ts` (TanStack Query) |
| 6 | **`useEffect` ilə data çəkmək** | `useQuery` / `useMutation` |
| 7 | **Ortaq primitivi yenidən yazmaq** — öz cədvəl/dialoq/forma/pagination wrapper-in | §4 siyahısındakı hazır komponentlər |
| 8 | **`any`, `@ts-ignore`, `eslint-disable`, `// @ts-nocheck`** | düzgün tip; tip bilinmirsə `unknown` + narrowing |
| 9 | **Yeni paket (`pnpm add`)** | mövcud paketlər; başqa yol yoxdursa **dayan və soruş** |
| 10 | **Hard-code mətn** (düymə, başlıq, toast, boş hal, validasiya mesajı) | `useTranslation('<ns>')` + 3 dil faylı (`az`/`en`/`tr`) |
| 11 | **Dərin nisbi import** — `../../../shared/...` | `@/` alias (`@/shared/...`, `@/components/...`) |
| 12 | **Bir fayl = bir neçə komponent** (ixracat edilən) | fayl adı = komponent adı (kebab-case fayl → PascalCase komponent) |
| 13 | **Başqa bölümün feature-ından import** — `@/features/product/...` içindən `@/features/order/...` | ortaq şey `@/shared/**` və ya `@/components/**`-ə çıxarılır |
| 14 | **Yeni zustand store** | mövcud `auth.store` / `auth-permission.store`; server datası **Query-dədir**, store-da deyil |
| 15 | **Mock datanı service-ə / komponentə yazmaq** | `src/mocks/<domain>.ts` + `src/mocks/index.ts` route map (axios interceptor kəsir) |
| 16 | **Konfiq fayllarına toxunmaq** — `vite.config.ts`, `tsconfig*`, `eslint.config.js`, `package.json` | toxunmursan; ehtiyac varsa soruş |

### Fayl ölçüsü hədləri (keçirsə **böl**, ad konvensiyasına uyğun)

| Fayl növü | Hədd | Keçəndə |
|---|---|---|
| komponent (`components/*.tsx`) | **150 sətir** | `-fields.tsx`, `-columns.tsx`, `-row-actions.tsx` kimi ayrı fayla ayır |
| hook (`hooks/*.ts`) | **80 sətir** | hər sorğu/mutasiya qrupu öz hook faylına |
| service (`data/*.service.ts`) | **120 sətir** | — (keçirsə bölüm çox böyükdür, dayan və soruş) |
| forma sxemi (`data/*.schema.ts`) | **120 sətir** | sahə qrupları üzrə `z.object` parçaları |

---

## 2. Qat bölgüsü (hər bölüm üçün dəyişməz)

```
data/      tip + zod sxem + axios service + queryKeys     → React bilmir, komponent import etmir
hooks/     useQuery / useMutation sarğıları               → yalnız data/-dan import edir
components/ render + forma sahələri + sütunlar            → yalnız hooks/-dan və shared/-dan import edir
index.tsx  səhifə kompozisiyası (shell + tab + table + dialogs)
routes/    createFileRoute + PageGuard + search sxemi     → yalnız features/<domain> import edir
```

**Bir istiqamətli axın:** `routes → index.tsx → components → hooks → data`. Geri istiqamətdə import **yoxdur**.
Biznes hesablaması (qiymət, komissiya, status keçidi) **backend-dədir**; frontend yalnız göstərir və göndərir.

---

## 3. Fayl manifesti (bir bölüm = bu fayllar, artıq fayl yaratma)

```
src/features/<domain>/index.tsx
src/features/<domain>/data/<domain>.type.ts
src/features/<domain>/data/<domain>.schema.ts
src/features/<domain>/data/<domain>.service.ts
src/features/<domain>/hooks/use<Domain>s.ts
src/features/<domain>/hooks/use<Domain>Mutations.ts
src/features/<domain>/components/<domain>-columns.tsx
src/features/<domain>/components/<domain>-table.tsx
src/features/<domain>/components/<domain>-fields.tsx
src/features/<domain>/components/<domain>-form.tsx
src/features/<domain>/components/<domain>-dialogs.tsx
src/features/<domain>/components/<domain>-provider.tsx
src/features/<domain>/components/<domain>-row-actions.tsx
src/features/<domain>/components/<domain>-primary-buttons.tsx
src/features/<domain>/components/<domain>-table-bulk-actions.tsx
src/routes/_authenticated/<route>/index.tsx
src/mocks/<domain>.ts
public/locales/az/<ns>.json   ·   public/locales/en/<ns>.json   ·   public/locales/tr/<ns>.json
```

**Yalnız əlavə sətir yazılan (mövcud sətirlərə toxunma):**
`src/shared/permissions.ts` · `src/components/layout/data/sidebar-data.<panel>.ts` · `src/mocks/index.ts`

Detal səhifəsi varsa: `components/<domain>-detail.tsx` + `routes/_authenticated/<route>/$id.tsx`.
Soft delete varsa: `components/<domain>-trash-{columns,table,row-actions}.tsx`.

---

## 4. Hazır komponentlər — İSTİFADƏ ET, yazma

| Lazım olan | Mövcud |
|---|---|
| data-table (sort, paginate, filtr, bulk, sütun görünüşü) | `@/components/data-table` → `EntityDataTable`, `EntityTrashDataTable` |
| səhifə çərçivəsi / başlıq | `@/components/admin` → `AdminPageShell`, `AdminCardShell`, `CrudTabsLayout` |
| forma | `@/components/forms` → `EntityFormPage`, `EntityFormDialog`, `LocaleFormTabs`, `TranslationsSection`, `SlugField`, `SeoFields` |
| təsdiq dialoqu | `@/components/confirm-dialog` |
| select / tarix / parol / rəng | `@/components/{select-dropdown,date-picker,password-input,color-picker}` |
| icazə yoxlaması | `@/components/guard` → `PageGuard`, `PermissionGuard`, `PanelGuard` |
| CRUD mutasiyaları | `@/hooks/use-crud-mutations`, `use-basic-crud-mutations`, `use-bulk-delete`, `use-trash-mutations` |
| səhifələnmiş sorğu | `@/hooks/use-paginated-query` |
| URL state (cədvəl) | `@/hooks/use-table-url-state` |
| dialoq state | `@/hooks/use-dialog-state` |
| Excel import/export | `@/hooks/use-excel-operations` + `@/components/admin/import-export-buttons` |
| valyuta formatı | `@/shared/hooks/useCurrencyFormatter` |
| sorğu stringi | `@/shared/utils/list-query-string` → `buildListQueryString` |
| 422 → forma xətası | `@/shared/utils/form` |
| cavab tipləri | `@/shared/types` → `WithData<T>`, `WithPagination<T>`, `MetaInterface` |
| ui primitивləri | `@/components/ui/*` (shadcn) — yenisini `pnpm dlx shadcn add` ilə **soruşmadan** əlavə etmə |

---

## 5. Kod kontraktları (dəyişmir)

**Service + queryKeys**

```ts
const BASE = '/admin/<resource>'
export const <domain>Service = {
  list: (params: <Domain>Params = {}) =>
    requestInstanceClient.get<WithPagination<<Domain>Interface[]>>(`${BASE}?${buildListQueryString({ ...params })}`),
  show: (id: string) => requestInstanceClient.get<WithData<<Domain>Interface>>(`${BASE}/${id}`),
  create: (payload: <Domain>Payload) => requestInstanceClient.post<void, <Domain>Payload>(BASE, payload),
  update: (id: string, payload: <Domain>Payload) => requestInstanceClient.put<void, <Domain>Payload>(`${BASE}/${id}`, payload),
  delete: (id: string) => requestInstanceClient.delete(`${BASE}/${id}`),
}
export const <domain>Keys = {
  all: ['<DOMAIN>'] as const,
  lists: () => [...<domain>Keys.all, 'list'] as const,
  list: (p?: <Domain>Params) => [...<domain>Keys.lists(), p] as const,
  detail: (id: string) => [...<domain>Keys.all, 'detail', id] as const,
}
```

**Route**

```tsx
export const Route = createFileRoute('/_authenticated/<route>/')({
  validateSearch: listSearchSchema,                 // @/shared/schemas/list-search.schema
  component: () => (
    <PageGuard permission={PERMISSIONS.<MODUL>.INDEX}>
      <<Domain>sPage />
    </PageGuard>
  ),
})
```

**Permission adları:** `<modul>.index · .show · .create · .update · .delete · .trash · .restore · .force_delete · .export · .import`
Satıcı panelində **eyni adlar** — `seller_id` məhdudiyyəti backend-dədir.

**Tərcümə olunan sahə** dəyəri obyektdir: `{ az: '', en: '', tr: '' }` → `LocaleFormTabs`.

**Mock**

```ts
// src/mocks/<domain>.ts — ən azı 12 sətir (paginate görünsün)
export const <domain>Mock: <Domain>Interface[] = [ /* ... */ ]
// src/mocks/index.ts — yalnız bu sətirlər əlavə olunur
'GET /admin/<resource>': paginate(<domain>Mock),
'GET /admin/<resource>/:id': single(<domain>Mock),
'POST|PUT|DELETE /admin/<resource>': ok(),
```

---

## 6. Sürət (ölçülən tələb — `task/admin/00-baseline.md` §14)

1. Hər ekran öz chunk-ında: `createLazyFileRoute`. Yeni chunk **≤ 40 KB gzip**.
2. TanStack Table **yalnız `getCoreRowModel`** — sıralama/filtr/səhifələmə serverdədir.
3. Siyahı sorğusunda `placeholderData: keepPreviousData` (səhifə dəyişəndə ekran ağarmır).
4. `columns` massivi komponentdən **kənarda** (və ya `useMemo`).
5. Select mənbəyi 50+ sətirdirsə tam siyahı yüklənmir: `?search=` + 300 ms debounce.
6. Şəkil: thumbnail URL, `loading="lazy"`, sabit `width`/`height`.
7. İkonlar adbaad: `import { Package } from 'lucide-react'` — barrel fayl yaratma.
8. `recharts` / rich-text yalnız lazım olan ekranda, dinamik import.
9. Bir ekran **≤ 3 sorğu**.

---

## 7. Mobil

Hər ekran 360px-də işləyir. Toxunma hədəfi **≥ 44×44px**. Kuryer paneli (`/courier`) mobil-öncədir:
cədvəl yerinə kart siyahısı, telefon `tel:` linki.

---

## 8. İş axını (hər sessiya)

1. **Oxu:** `D:\www\xshop\task\admin\<NN>-<bölüm>.md` (13 bölmə: ekran inventarı, data sxemi, siyahı, forma, endpoint, i18n, DoD).
2. **Oxu:** bölüm faylında göstərilən **referans feature** (`1c-prielaz/admin/src/features/<x>/**`) — nüsxə çıxaracağın şablon.
3. **Yaz:** §3 manifestindəki faylları, §5 kontraktları ilə.
4. **Yoxla:** `pnpm build && pnpm lint && pnpm knip && pnpm test` + §9 grep-ləri.
5. **Hesabat:** 5 sətirdən çox olmayan "nə etdim" + pozulan qayda varsa səbəbi.

**Bir sessiya = bir bölüm.** İki ekranı birlikdə yazma. Plan faylında olmayan feature əlavə etmə.

Qeyri-müəyyənlik varsa (sahə tipi, endpoint, status axını) **uydurma** — plan faylındaki `§13 Açıq suallar`-a bax,
cavab yoxsa dayan və soruş.

---

## 9. Öz-yoxlama (bitirməzdən əvvəl bunları çalışdır)

```bash
cd D:\www\xshop\admin

# 1. Qadağalar (hamısı BOŞ çıxmalıdır)
grep -rn "style={{" src/features/<domain>                       # inline CSS
grep -rn "dangerouslySetInnerHTML\|document\.\|<script" src/features/<domain>
grep -rn ": any\|@ts-ignore\|eslint-disable" src/features/<domain>
grep -rn "axios\|fetch(" src/features/<domain>/components        # komponentdə sorğu
grep -rn "useEffect" src/features/<domain>                       # data üçün useEffect
grep -rn "\.\./\.\./\.\." src/features/<domain>                  # dərin nisbi import
grep -rn "@/features/" src/features/<domain> | grep -v "<domain>"  # başqa bölümdən import

# 2. Fayl ölçüsü
find src/features/<domain> -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -rn | head

# 3. Dil faylları — 3-ü də var və açar dəstləri eynidir
ls public/locales/{az,en,tr}/<ns>.json

# 4. Build + keyfiyyət
pnpm build && pnpm lint && pnpm knip && pnpm test
```

`pnpm build` çıxışındaki yeni chunk ölçüsünü hesabatında yaz.

---

## 10. Sənin tez-tez düşdüyün səhvlər (xüsusi diqqət)

- `WithPagination` zərfini unudub `T[]` qaytarmaq
- `queryKey`-i sabit obyekt yerinə string yazmaq
- hazır shadcn komponentini yenidən yazmaq (`Dialog`, `Table`, `Select`)
- i18n-i yalnız `az` üçün yazmaq (3 fayl məcburidir, açarlar eyni)
- mock-u service faylının içinə qoymaq
- `index.tsx`-i 300 sətirlik tək fayla çevirmək (manifestdəki fayllara böl)
- `style={{ width: 120 }}` kimi "kiçik" inline CSS — **yenə də qadağadır**, `className='w-30'`
