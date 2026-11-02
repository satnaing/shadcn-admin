---
name: admin-parity-check
description: Bütün admin bölümləri bitəndən sonra AEC admin paneli ilə tam müqayisə edir — AEC-də olub bizdə olmayan ekranları və CUSTOM-TASKS.md tələblərini tapıb bağlayır. İstifadə et "full check", "parity", "AEC ilə müqayisə", "nə çatışmır", "final yoxlama" xahişlərində.
---

# admin-parity-check — final yoxlama (ucuz)

Hədəf: `D:\www\xshop\admin`. **İşə yalnız bütün planlı bölümlər `hazır` olanda başla** (`task/admin/README.md` §1).
Qayda: **skript say**, model yalnız boşluqları bağlayır. AEC kodunu və `shop.sql`-i oxumursan.

## 0. Token büdcəsi

| Hədd | Dəyər |
|---|---|
| Tool çağırışı | ≤ 30 (yoxlama) + bölüm başına ≤ 25 (boşluq bağlama) |
| Bütöv oxunan fayl | **yoxdur** — yalnız skript çıxışı və `grep -c` |
| Qadağa | `D:\www\aec` kodu · `api-index.md` · `db-index.md` bütöv oxunmur |

## 1. Addım — ekran parity (skript, ~0 token)

```bash
cd D:/www/xshop/admin
node .claude/skills/admin-parity-check/parity.mjs all
```

Çıxış hər panel üçün: yarpaq sayı · ✅ ⏭ ⊘ 🔄 · **STATUSSUZ siyahı**.
Statussuz = AEC-də var, bizdə nə ✅ (yazıldı) nə ⏭ (Faza D) nə ⊘ (qərarla çıxarıldı) işarəsi var.

**Hər statussuz sətir üçün 3 variantdan birini seç:**

| Hal | Əməl |
|---|---|
| Ekran artıq yazılıb, işarə unudulub | `grep -rn "<route-adı>" src/routes src/components/layout/data` ilə təsdiqlə → `sed -i` ilə `✅` qoy |
| Qərarla çıxarılıb (GST, landing builder, system_update, selector-lar, dropshipping) | `⊘` / `⏭` qoy, səbəb `task/admin/README.md` §1 sonunda var |
| Həqiqətən çatışır | **siyahıya yığ** (aşağıda §4), hələ yazma |

## 2. Addım — custom tələblər

`D:/www/xshop/task/admin/CUSTOM-TASKS.md`-dəki cədvəli **sətir-sətir** icra et: hər tələbin "yoxla" sütunundakı əmri çalışdır,
nəticəyə görə `[ ]` → `[x]` və ya boşluq siyahısına əlavə.

## 3. Addım — sistem yoxlamaları (sıra ilə, hər biri 1 əmr)

```bash
npx pnpm@12 build 2>&1 | tail -4                  # tsc + vite, chunk ölçüsü
npx pnpm@12 lint  2>&1 | tail -3
npx pnpm@12 knip  2>&1 | tail -15                 # istifadəsiz fayl = yarımçıq bölüm əlaməti
for l in az ru tr en; do echo $l $(ls public/locales/$l | wc -l); done   # dil faylı sayı EYNİ olmalıdır
node -e "const fs=require('fs');const b=fs.readdirSync('public/locales/az');for(const f of b){const k=l=>Object.keys(JSON.parse(fs.readFileSync('public/locales/'+l+'/'+f,'utf8'))).length;const r=['ru','tr','en'].filter(l=>!fs.existsSync('public/locales/'+l+'/'+f)||k(l)!==k('az'));if(r.length)console.log(f,'uyğunsuz:',r.join())}"
```

## 4. Addım — boşluqları bağla

Boşluq siyahısını **bölüm üzrə qruplaşdır** (hansı `NN-*.md` faylına aiddir). Hər qrup üçün:

1. Tapşırıq faylında həmin ekran var? Yoxsa — faylın §1 cədvəlinə **bir sətir** əlavə et (route, tip, permission).
2. `admin-section` skilli ilə **yalnız çatışan ekranı** yaz (bütün bölümü yenidən yox).
3. `✅` işarələ.

Bir sessiyada ≤ 3 boşluq. Sonra yeni sessiya.

## 5. Hesabat (≤ 10 sətir)

```
parity: admin X/Y · seller X/Y · courier X/Y   (statussuz qalan: N)
custom tələblər: X/Y ✅   (açıq: …)
build · lint · knip · locales parity
çatışan və yazılmayan: … (səbəb)
risk: …
```

## 6. Dayanma halları

- 20-dən çox statussuz yarpaq çıxsa — **bölümlər bitməyib**, parity vaxtı deyil; hansı bölümlərin açıq qaldığını yaz və dayan
- Statussuz ekranın `⊘` olub-olmamasında şübhə varsa — özün qərar vermə, istifadəçidən soruş
- `CUSTOM-TASKS.md` tələbi ilə bölüm faylı ziddiyyətdədirsə — soruş
