---
name: admin-section
description: xshop admin panelinin bir bölümünü (ekran dəstini) minimum token ilə yazır. İstifadə et "bölüm yaz", "01-dashboard yaz", "admin section", "növbəti bölüm" kimi xahişlərdə və ya task/admin/NN-*.md faylı icra olunanda.
---

# admin-section — bir bölümü ucuz yazmaq

Hədəf: `D:\www\xshop\admin`. Qaydalar `GEMINI.md`-dədir (qadağalar, manifest, kontraktlar).
**Bir sessiya = bir bölüm.** Bölüm adı `NN-<ad>` formatındadır (`task/admin/README.md` §1 cədvəli).

## 0. Token büdcəsi (pozma)

| Hədd | Dəyər |
|---|---|
| Oxunacaq fayl | **≤ 6** (bölüm faylı · 1 referans feature · GEMINI.md · 1-2 mövcud feature nümunəsi) |
| Tool çağırışı | **≤ 25** |
| Bütöv oxunan fayl | yalnız bölüm faylı. Qalanı `grep -n` + `sed -n 'A,Bp'` |
| Qadağa | `D:\www\aec` **koduna heç vaxt baxmırsan** · `task/api-index.md`, `db-index.md`, `shop.sql` **bütöv oxunmur** |

Lazım olan məlumat bölüm faylında var. Orada yoxdursa — **dayan və soruş**, axtarmağa getmə.

## 1. Oxu (bu sıra, artıq yox)

```bash
cat  D:/www/xshop/task/admin/<NN-ad>.md                    # 1. tapşırıq (13 bölmə) — bütöv
grep -n "^| " D:/www/xshop/task/admin/SECTION-PROMPT.md | head -20   # 2. referans feature cədvəli (§1)
ls   D:/www/1c-prielaz/admin/src/features/<referans>/**    # 3. şablonun fayl siyahısı
```

Referans feature-dan **yalnız bu 5 faylı** oxu: `data/*.service.ts` · `hooks/use<X>s.ts` ·
`components/<x>-columns.tsx` · `components/<x>-form.tsx` (və ya `-fields.tsx`) · `index.tsx`.
Qalanını (dialogs, provider, row-actions, bulk-actions, table) **oxumadan** eyni adla, eyni struktura görə yazırsan —
onlar şablon faylıdır, məzmunu domenə bağlı deyil.

GEMINI.md-ni bir dəfə oxu (§1 qadağalar, §3 manifest, §5 kontraktlar). Sessiyada ikinci dəfə oxumursan.

### 1b. Bölüm faylı YOXDURSA (01–36 çoxu hələ yazılmayıb) — yığcam spesifikasiya yarat

Bütöv `menu-index`/`db-index`/`api-index` oxuma. Yalnız bunlar:

```bash
# a) bölümün ekranları (AEC-SIDEBAR-MENU.md §0 cədvəlindən qrup tap, sonra yalnız o qrupun sətirləri)
grep -n "<qrup adı>" D:/www/xshop/admin/AEC-SIDEBAR-MENU.md | head -5      # sonra sed -n 'A,Bp'
# b) yalnız lazım olan cədvəllərin sütunları (1 cədvəl = 1 sətir)
grep -n -A2 "^### <cədvəl>$" D:/www/xshop/task/db-index.md
# c) endpoint adları lazım deyil — REST konvensiyası: /admin/<resurs> (list/show/create/update/delete), GEMINI.md §5
```

`D:/www/xshop/task/admin/<NN-ad>.md` faylını **≤ 60 sətir** yaz (başlıq · ekran cədvəli · sahə cədvəli ·
siyahı sütunları/filtrlər · forma qrupları · i18n açarları · açıq suallar), sonra həmin faylı əsas götürüb §2-yə keç.
Fayl sonradan sənin (istifadəçinin) düzəlişinə açıqdır — uydurma sahə yazma: db-index-də olmayan sahə `—` qalır.

**Qərar qatı (hər bölümdə):** `CUSTOM-TASKS.md`-də bu bölümə aid sətir varsa (məs. wholesale → #8-9, komissiya → #11-12,
paketlər → #10) o tələb spesifikasiyaya **daxil edilməlidir** — AEC-in davranışı ilə ziddiyyət olsa CUSTOM-TASKS qalib gəlir.

## 2. Plan (≤ 10 sətir)

Yazılacaq faylların siyahısı (GEMINI.md §3 manifesti) + hansı referans feature-dan. Manifestdən artıq fayl yoxdur.
Plan yazıldıqdan sonra təsdiq gözləmirsən — yazmağa keçirsən.

## 3. Yaz (sıra: data → hooks → components → index → route → mock → i18n → qeydiyyat)

```
src/features/<domain>/data/<domain>.{type,schema,service}.ts
src/features/<domain>/hooks/use<Domain>s.ts · use<Domain>Mutations.ts
src/features/<domain>/components/<domain>-{columns,table,fields,form,dialogs,provider,row-actions,primary-buttons,table-bulk-actions}.tsx
src/features/<domain>/index.tsx
src/routes/_authenticated/<panel>/<route>/index.tsx
src/mocks/<domain>.ts                        ≥ 12 sətir fixture
public/locales/{az,ru,tr,en}/<ns>.json       DÖRD dil, eyni açarlar
```

Yalnız əlavə sətir (mövcud sətirlərə toxunma): `src/shared/constant.ts` (PERMISSIONS bloku) ·
`src/components/layout/data/sidebar-data.<panel>.ts` · `src/mocks/index.ts`.

**Yazarkən fayl oxumursan.** Şablon yaddaşındadır; şübhə varsa referans faylın **o sətirlərinə** `sed -n` ilə bax.

## 4. Yoxla (bir dəfə, sonda)

```bash
cd D:/www/xshop/admin && npx pnpm@12 build 2>&1 | tail -5
npx pnpm@12 lint 2>&1 | tail -3
grep -rn "style={{\|dangerouslySetInnerHTML\|document\.\|: any\|@ts-ignore\|console\.log" src/features/<domain>
grep -rn "@/features/" src/features/<domain> | grep -v "<domain>"
```

Build qırmızıdırsa: xətanı **oxumadan düzəltmə** — xəta sətrinə `sed -n` ilə bax, nöqtəvi düzəlt, yenidən build.
İki dövrədən çox çəkirsə dayan və nəyin düşdüyünü yaz.

## 5. Bitir

1. `D:/www/xshop/admin/AEC-SIDEBAR-MENU.md` — bitən ekranları `✅` ilə işarələ (həmin sətirlərə `sed -i`, faylı bütöv yazma).
2. `D:/www/xshop/task/admin/<NN-ad>.md` — başlıqdaki `Status:` → `hazır`.
3. Hesabat (**5 sətir, nəsr yox**): fayl sayı · build/lint · yeni chunk (KB gzip) · yoxlanılmayan · risk.

## 6. Dayanma halları (kod yazma, soruş)

- Bölüm faylının §13-də cavabsız sual var və cavab kodun formasını dəyişir
- Bölüm faylı yoxdur və ya §3/§4/§5 boşdur
- Tapşırıq mövcud ortaq komponentlə həll olunmur (yeni primitiv lazımdır)
- Yeni paket lazımdır
- `scope` şərtləri 3-dən çox yerə yığılır (GEMINI.md §1/4 — ekran öz faylına ayrılmalıdır)
