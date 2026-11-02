# ADMIN-QUEUE — qalan işin növbəsi (Sonnet 5.5, token-qənaətli)

İki skill (`.claude/skills/`): **`admin-section`** (bir bölüm yaz) · **`admin-parity-check`** (final yoxlama).
Qaydalar: `GEMINI.md` · tələblər: `task/admin/CUSTOM-TASKS.md` · izləmə: `AEC-SIDEBAR-MENU.md` (✅ ⏭ ⊘ 🔄).

## Sessiya promptları (yalnız bunları yaz)

**Bölüm:**
```
admin-section skillini işlət. Bölüm: 03-products
```

**Final yoxlama** (hamısı bitəndən sonra):
```
admin-parity-check skillini işlət.
```

**Vəziyyət** (0 token, terminalda): `node .claude/skills/admin-parity-check/parity.mjs all`

## Qaydalar (token üçün)

- **Bir sessiya = bir bölüm.** Sessiya uzananda kontekst şişir — bölümlər arasında yeni sessiya aç.
- Bölüm faylı yoxdursa skill özü ≤ 60 sətirlik spesifikasiya yaradır; **sən onu oxuyub düzəlt**, sonra yazmağa keçsin.
- Skill `AEC` kodunu və bütöv indeksləri oxumur. Nəsə çatmırsa dayanıb soruşur.

## İcra sırası

| # | Bölüm | Asılılıq | Qeyd |
|---|---|---|---|
| 0 | `00b-panels-and-roles` (P1) | — | **ilk bu**; 4 nav ağacı, `PanelGuard`. Hazır task faylı var |
| 1 | `01-dashboard` | 0 | 6 blok |
| 2 | `02-catalog` | 0 | kateqoriya, brend, atribut, vahid… |
| 3 | `03-products` | 2 | **wholesale (`type`) + qiymət pilləsi bura** (CUSTOM #8–9) |
| 4 | `22-wholesale` | 3 | ayrı menyu, **yeni feature yox** |
| 5 | `13-media` | 0 | `ImagePicker` tam versiya (məhsul formasına lazımdır — 3-dən əvvələ çəkmək olar) |
| 6 | `18-settings`, `19-shipping` | 0 | ölkə/valyuta/vergi (CUSTOM #15–17) |
| 7 | `24-stores` | 6 | tək mağazada menyuda gizli (CUSTOM #18) |
| 8 | `04-orders`, `25-pos` | 3 | |
| 9 | `05-customers`, `06-sellers` | 0 | **komissiya 4 ölçü tək ekran** + supervisor siyahısı (CUSTOM #11–12) |
| 10 | `23-seller-packages` | 9 | çoxölçülü (CUSTOM #10) |
| 11 | `07-promotions`, `08-marketing`, `09-analytics` | 3 | |
| 12 | `10-reports`, `14-communication`, `11-appearance`, `12-ai-studio` | 3,4 | |
| 13 | `15-payments`, `16-otp`, `17-courier` | 6 | `17` = **adapter siyahısı + bir konfiq forması** (CUSTOM #14) |
| 14 | `20-staff`, `21-system` | 0 | `20` əsası pilotla hazırdır |
| 15 | `30`–`36` vendor | 3,4,9 | 15 ekran `scope='seller'`; `seller.couriers` (CUSTOM #7) |
| 16 | `37-courier` (P3), `38-supervisor` (P4) | 0, 9 | task faylları hazırdır |
| 17 | **admin-parity-check** | hamısı | AEC ilə full müqayisə + CUSTOM-TASKS |

## Hazır task faylları

`00b-panels-and-roles` · `37-courier` · `38-supervisor` · `CUSTOM-TASKS` · `README` (qərarlar E1–E35).
Qalanı (`01`–`36`) skill yığcam şəkildə özü yaradır (§1b).
