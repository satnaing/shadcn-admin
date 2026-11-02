# PROMPTS.md — Gemini / Antigravity chat panelinə yapışdırılacaq hazır promptlar

Qaydalar `GEMINI.md` + `AGENTS.md`-dədir (avtomatik yüklənir). Burada yalnız **tapşırıq mətnləri** var.
**Bir sessiya = bir prompt.** Sıra pozulmur: P1 → P2 → P3 → P4 → sonra bölüm-bölüm (P5).

Workspace-ə bu üç qovluq əlavə olunmalıdır, yoxsa model tapşırığı və nüsxə çıxaracağı kodu görmür:
`D:\www\xshop\admin` · `D:\www\xshop\task` · `D:\www\1c-prielaz\admin`

---

## P1 — Panel qatı (ƏVVƏLCƏ BU; dörd panelin skeleti)

```
GEMINI.md və AGENTS.md qaydaları qüvvədədir.

Tapşırıq: `D:/www/xshop/task/admin/00b-panels-and-roles.md` faylını icra et.

Oxu (sıra ilə):
1. `D:/www/xshop/task/admin/00b-panels-and-roles.md` — tam spesifikasiya (13 bölmə)
2. `D:/www/xshop/task/admin/README.md` §3 — E13, E16, E19, E30, E32, E34 qərarları
3. `D:/www/xshop/admin/src/components/layout/` — mövcud sidebar/nav kodu (1c-prielaz-dan gəlib, ERP menyusu ilə)
4. `D:/www/xshop/admin/AEC-SIDEBAR-MENU.md` §0 — qrup → bölüm xəritəsi (menyu ağaclarının mənbəyi)

Yaz:
- `src/config/panels.ts` — rol → {panel, prefix, navKey, landing}. Rollar: admin, staff, seller, seller_staff, courier, supervisor, customer(panel yox)
- `src/components/guard/panel-guard.tsx` — rol ↔ prefix uyğunsuzluğunda 403 (redirect YOX)
- `src/shared/hooks/useScope.ts` — 'admin' | 'seller' | 'courier' | 'supervisor'
- `src/components/layout/data/sidebar-data.{admin,seller,courier,supervisor}.ts` — DÖRD ağac.
  Hələlik yalnız mövcud ekranlar + boş qruplar (qrup adları AEC-SIDEBAR-MENU.md §1-dən; boş qrup render olunmur).
  Mövcud `sidebar-data.ts` (ERP menyusu) silinir.
- `src/components/layout/app-sidebar.tsx` — ağacı rola görə seçir (mövcud fayla minimal düzəliş)
- `src/features/auth/data/auth.store.ts` — `panel`, `seller_id` sahələri (mövcud fayla əlavə)
- `src/routes/_authenticated/{admin,seller,courier,supervisor}/route.tsx` — hər biri PanelGuard ilə
- `src/mocks/{staff,roles}.ts` + `src/mocks/index.ts`-ə route sətirləri
- `public/locales/{az,en,tr}/panel.json` + `nav.json`

Mövcud `features/users`, `features/role`, `features/permission` ekranlarını `/admin` ağacına köçür (route yolları dəyişir).

Bitirəndə: `npx pnpm@12 build && npx pnpm@12 lint` yaşıl olmalıdır. 5 sətirlik hesabat ver.
Qeyri-müəyyənlik varsa uydurma — dayan və soruş.
```

---

## P2 — Admin panelinin ilk ekranı (dashboard)

> `01-dashboard.md` **hələ yazılmayıb**. Əvvəlcə mən (və ya sən) o faylı yazmalıyam; prompt hazırdır.

```
GEMINI.md və AGENTS.md qaydaları qüvvədədir.

Bölüm: 01-dashboard

1. Oxu: `D:/www/xshop/task/admin/01-dashboard.md`
2. Oxu: `D:/www/xshop/task/admin/SECTION-PROMPT.md` §1 → bu ekran tipi üçün referans feature
3. Oxu: referans feature-ın bütün faylları `D:/www/1c-prielaz/admin/src/features/<ad>/**`
4. Qısa plan (GEMINI.md §3 manifesti), sonra faylları yaz
5. `npx pnpm@12 build && npx pnpm@12 lint` — yaşıl olana qədər özün düzəlt
6. `AEC-SIDEBAR-MENU.md`-də bitən ekranları ✅ ilə işarələ
7. 5 sətirlik hesabat
```

---

## P3 — Kuryer paneli

```
GEMINI.md və AGENTS.md qaydaları qüvvədədir.

Tapşırıq: `D:/www/xshop/task/admin/37-courier.md` faylını icra et (6 ekran).

Oxu: həmin fayl (13 bölmə) + `D:/www/xshop/task/admin/README.md` E34 (kuryer sahibliyi) +
referans: `D:/www/1c-prielaz/admin/src/features/order/**` (status axını) və `features/stock-movement/**` (ledger siyahıları).

Diqqət:
- 6 status (assigned/picked_up/on_the_way/pending/delivered/cancelled) **bir siyahı ekranıdır**, nav-da 6 element eyni route-a fərqli `?status=` ilə gedir
- Status keçidləri yalnız §6 cədvəlindəki kimi; icazəsiz keçid UI-da görünmür
- `delivered` + COD → məbləğ təsdiqi modalı
- Mobil əsas rejimdir: 360px-də kart görünüşü, `tel:` linki, 44px toxunma hədəfləri
- `collections` və `earnings` yalnız oxunandır — heç bir yazma düyməsi yoxdur

Bitirəndə `npx pnpm@12 build && npx pnpm@12 lint` yaşıl. 5 sətirlik hesabat.
```

---

## P4 — Supervisor (reseller) paneli

```
GEMINI.md və AGENTS.md qaydaları qüvvədədir.

Tapşırıq: `D:/www/xshop/task/admin/38-supervisor.md` faylını icra et.

Oxu: həmin fayl + `README.md` E32 (rol), E13 (`scope`) + referans:
`D:/www/1c-prielaz/admin/src/features/customer/**` (siyahı+forma), `features/debt-payment/**` (ledger + ödəniş modalı).

Diqqət:
- Həqiqətən yeni feature yalnız 4 ekrandır: dashboard, earnings, withdrawals, payments
- `/supervisor/sellers` və `/supervisor/stores` **yeni feature deyil** — mövcud feature `scope='supervisor'` ilə.
  O feature-lar hələ yazılmayıbsa, bu iki route-u **yazma**, hesabatda qeyd et
- `supervisor_id` formada sahə kimi YOXDUR (backend qoyur)
- Qazanc ekranı yalnız oxunandır, sifariş detalına keçid yoxdur
- Çıxarış modalı: məbləğ ≤ balans, min limit, balans 0-da düymə disabled

Bitirəndə `npx pnpm@12 build && npx pnpm@12 lint` yaşıl. 5 sətirlik hesabat.
```

---

## P5 — Qalan bölümlər (şablon)

`<NN-bölüm>` yerinə növbəti bölümü yaz (`AEC-SIDEBAR-MENU.md` §0 cədvəlindən tap). Sıra: `01` → `02` → `03` → …

```
GEMINI.md və AGENTS.md qaydaları qüvvədədir.

Bölüm: <NN-bölüm>

1. Oxu: `D:/www/xshop/task/admin/<NN-bölüm>.md`
2. Oxu: `D:/www/xshop/task/admin/SECTION-PROMPT.md` §1 → referans feature
3. Oxu: referans feature-ın bütün faylları `D:/www/1c-prielaz/admin/src/features/<ad>/**`
4. Qısa plan (GEMINI.md §3 manifesti), sonra faylları yaz
5. `npx pnpm@12 build && npx pnpm@12 lint` — yaşıl olana qədər özün düzəlt
6. `AEC-SIDEBAR-MENU.md`-də bitən ekranları ✅ ilə işarələ
7. 5 sətirlik hesabat: fayl sayı · build/lint · yeni chunk ölçüsü · yoxlanılmayan · risk

Tapşırıq faylında cavabsız sual (§13) varsa və cavab kodun formasını dəyişirsə — kod yazma, soruş.
```

---

## P6 — Yoxlama (hər bölümdən sonra, ayrı sessiyada)

```
Yalnız audit et, kod yazma. Hədəf: src/features/<domain>

1. Çalışdır: `npx pnpm@12 build`, `npx pnpm@12 lint`, `npx pnpm@12 knip`
2. Qadağa yoxlaması (hamısı boş olmalıdır):
   grep -rn "style={{\|<style\|dangerouslySetInnerHTML\|document\.\|: any\|@ts-ignore\|console\.log" src/features/<domain>
   grep -rn "from '\.\./\.\./\|@/features/" src/features/<domain>
3. GEMINI.md §1 cədvəlinin hər bəndini fayl-fayl yoxla (ölçü hədləri, qat bölgüsü, i18n, mock yeri)
4. Çıxış: `| # | Fayl:sətir | Pozulan qayda | Nə etmək lazımdır |` cədvəli, ciddiliyə görə sıralı.
   Tapıntı yoxdursa bir sətir: "təmiz".
```

---

## Hazır olan / olmayan tapşırıq faylları

| Prompt | Tapşırıq faylı | Status |
|---|---|---|
| P1 | `00b-panels-and-roles.md` | **hazır** |
| P3 | `37-courier.md` | **hazır** |
| P4 | `38-supervisor.md` | **hazır** |
| P2 / P5 | `01-dashboard.md` … `25-pos.md`, `30`–`36` | **yazılmayıb** — hər biri yazılandan sonra icra olunur |

Bölüm faylı olmadan P5-i işə salma: model spesifikasiyanı uyduracaq.
