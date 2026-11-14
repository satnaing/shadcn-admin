# Front analizi — Topbar · Header · Menu/MegaMenu · Footer · Banner · Slider

Status: v1 · 2026-11-14 · Mənbə: yalnız oxunub (`front/xshop-front`, `front/senseihost-front`). Admin v2 **Themes** ekranlarının sahələri bu sənəddən götürülür (forma uydurulmur). Fayl yolları `src/` altındadır.

## 0. Ümumi nəticə (5 sətir)
1. **Header/Topbar/Footer/Menu iki frontda da section DEYİL**, qlobal layout komponentidir (`AppShell` / `layout.tsx`); `section_catalog`-a düşmür → Themes bölməsi onları **tema-qlobal ayarlar** kimi saxlamalıdır (səhifəyə bağlı deyil).
2. **Mənbə hər ikisində statikdir** (xshop `mocks/header.json`, `mocks/footer.json`; senseihost `mocks/nav.ts` + next-intl `messages/{az,en,tr,ru}`) → API-yə köçürmə forması bu faylların strukturudur.
3. **Variant yoxdur** (xshop: 1 TopBar + 1 MainHeader + 1 Footer; senseihost: 1 TopBar + 1 Header [`stuck`/compact avtomatik hal] + 1 Footer). «Header/Footer variantları» (plan 71) üçün **kod bazası yoxdur** → açıq sual Q-F1.
4. **Menu**: xshop = düz nav + 1 səviyyəli dropdown + **kateqoriya mega menyusu** (kateqoriya → alt kateqoriya adları, emoji ikon); senseihost = **qrup mega menyusu** (lead tile + 2 sütunlu kartlar + deal zolağı, lucide ikon, label/desc i18n açarı) + Tools mega + mobil menyu + hamburger paneli.
5. **Banner/Slider** hər iki frontda **section-lardır** (payload `slides/banners/rightBanners`); xshop-da `bgColor` (hex) / `tone` (4 ad), senseihost-da **tema tokenləri** (hex yoxdur, `locked_tokens`) və mətnlər i18n açarıdır.

---

## 1. xshop-front

### 1.1 Topbar — `components/layout/TopBar.tsx` (227 sətir)
| Maddə | Dəyər |
|---|---|
| Data | `mocks/header.json → topBar` (statik import) |
| Forma | `topBar: { supportPhone: string, supportText: string, defaultLanguage: string, languages: {code,label,flag(emoji)}[], defaultCurrency: string, currencies: {code,symbol,label}[], promoAlert: {category,discount,period}, utilityLinks: {name,href}[] }` |
| Davranış | dil və valyuta açılan menyu (click-outside), seçim yalnız lokal state (persist yox); mətnlər düz (i18n açarı yox) |
| Responsive | `hidden md:block` — mobildə **yoxdur**; ≥md-də tək sətir: sol (dəstək telefonu pill + dil + valyuta), sağ (`promoAlert` + `utilityLinks`) |
| Variant | yoxdur |

### 1.2 Header — `components/layout/MainHeader.tsx` (469 sətir) + `SearchBox.tsx`, `AccountMenu.tsx`, `CategoryMenu.tsx`, `ThemeToggle.tsx`, `NotificationsMenu.tsx`
| Maddə | Dəyər |
|---|---|
| Data | `header.json → mainHeader` |
| Forma | `mainHeader: { logo:{text,href}, search:{placeholder}, account:{label,actionText}, support:{label,phone}, categoriesButtonText, categories:[…], navigation:[…], homeVariants:[{id,name,subtitle,icon,href}] }`. `homeVariants` JSON-da var, **komponentdə istifadə olunmur** |
| Quruluş | sticky `top-0 z-40`, blur fonu; **sətir 1**: hamburger (mobil), loqo (dairə içində ilk hərf + mətn — şəkil loqo yoxdur), axtarış (`hidden md:block`), ThemeToggle, AccountMenu, Wishlist (say), Cart (say, `xl`-də mətn); **sətir 2** (`hidden lg:block`): kateqoriya mega düyməsi + `navigation` + «24/7 Support»; mobil: off-canvas drawer (kateqoriya akkordeon, `navigation`) + alt sabit tab bar (`lg:hidden`, h-16) |
| Variant | yoxdur |
| Hard-code | «Bölmələr (N)» sayı `mocks/sections.json`-dan; Wishlist/Cart mətnləri komponentdə sərt |

### 1.3 Menu / MegaMenu
| Maddə | Dəyər |
|---|---|
| Nav (`navigation[]`) | `{ id: string, name: string, href: string, hasDropdown: boolean, items?: {name,href}[] }` — dropdown **1 səviyyə** (`w-64` kart); aktiv link `pathname` ilə təyin olunur |
| Mega (`CategoryMenu.tsx`, 138 sətir) | `categories[]: { name: string, icon: string(emoji), hasSub: boolean, subCategories: string[] }`; sol: kateqoriya siyahısı, sağ: hover/fokus olunanın alt adları (`w-[min(760px,92vw)]`); alt kateqoriya **yalnız mətndir (href yoxdur)**; Esc/click-outside bağlanır |
| Mobil | eyni `categories`, akkordeon (`openMobileCat`) |
| Drag-drop ehtiyacı | 3 səviyyə yox: **Nav 2 səviyyə** (item→items), **Mega 2 səviyyə** (category→sub string) |

### 1.4 Footer — `components/layout/Footer.tsx` (275 sətir)
| Maddə | Dəyər |
|---|---|
| Data | `mocks/footer.json` |
| Forma | `brand:{name,description,socials:{name,href}[],appDownload:{title,googlePlay:{title,subtitle,href},appStore:{…}}}`, `columns:{title,links:{name,href}[]}[]` (3 sütun), `contact:{title,address,phone,email,fax}` (komponent `fax`-ı göstərmir), `paymentMethods: string[]`, `bottomBar:{copyright,links:{name,href}[]}` |
| Quruluş | 12 sütunlu grid: brand tile (xl:4) · link sütunları (xl:5, `md:grid-cols-3`, **mobildə akkordeon**) · contact kart (xl:3); alt bar: copyright + ödəniş çipləri + hüquqi linklər; «yuxarı» düyməsi (scrollY>400) |
| Social ikon | `name` üzrə sərt SVG xəritəsi (Facebook, Instagram, LinkedIn, Pinterest, Behance, …) |
| Variant | yoxdur |

### 1.5 Banner / Slider section-ları (`sections-xshop.generated.md`)
| Section (`component`) | Fayl | Payload (dəqiq) | Variant / davranış |
|---|---|---|---|
| `BeautyHeroSlider` | `components/bento/BentoBeautyHeroSlider.tsx` (re-export `home2/BeautyHeroSlider.tsx`) | `{ slides: {id,badge,tag,title,description,ctaText,ctaLink,bgColor,image}[], rightBanners: {id,badge?,badgeBg?,badgeColor?,vendorTag?,title,subtitle,ctaText?,ctaLink,bgColor,image,price?,originalPrice?}[] }` | avtomatik 6 s, 12-grid: slayder `lg:8` + sağ kartlar `lg:4` (`sm:2`-sütun); min-h 440/480 |
| `HeroSlider` | `components/home/HeroSlider.tsx` (310) | `{ banners: {id,title,subtitle,description,ctaText,ctaLink,image,badge?,bgColor?}[], deal:{eyebrow,vendor,product:{…Product},stockLeft,stockTotal} }` | 5.5 s auto, sürüklə (`cursor-grab`), oxlar `sm+` hover-də, sağda deal tile + geri sayım (1 s tick); min-h 520/560 |
| `TrioLifestyleBanners` | `home2/TrioLifestyleBanners.tsx` | `{id,image,badge,title,subtitle,ctaText,ctaLink,tone}[]` (3–4) | `tone`: `sage|blush|sky|lavender` (sabit palitra xəritəsi `{bg,fg}`); birinci «anchor» `lg:6`, qalanı `lg:3` |
| `PromoBanners` | `home/PromoBanners.tsx` | `{id,title,subtitle,description,ctaText,ctaLink,image,tone}[]` (2) | `tone` (`sage|amber` fallback növbəli); `lg:6` hər biri |
| `DualPromoBanner` | `home2/DualPromoBanner.tsx` | `{ leftCard:{badge,title,subtitle,ctaText,ctaLink,image}, rightCard:{…eyni} }` | sol `lg:4`, sağ `lg:8` (şəkil `hidden sm:flex`) |
| `PrescriptionBanner` | `home/PrescriptionBanner.tsx` | `{eyebrow,title,description,ctaText}` | CTA modal açır (link yox) |
| `BrandLogoSlider` | `home2/BrandLogoSlider.tsx` | `{title,subtitle,items:{id,name,image,href}[],viewAllText,viewAllLink}` | `useDraggableSlider` (autoplay 4500 ms, loop, `scrollMultiplier 0.8`), oxlar |
| `ShopHeroBanner` | `shop/ShopHeroBanner.tsx` | statik `shop.json`; props `onSearch,onSelectCategory,selectedCategory` | shop səhifəsinə bağlı |
| Digər slayderlər | `FlashDealSection`, `DealsOfTheDayTwinSection`, `PremiumPicksSavingsSection`, `PDPRelatedProductsSlider` | məhsul slayderləri (banner deyil) | `useDraggableSlider` |
| Ortaq | — | `bgColor` **sərbəst hex** (BeautyHeroSlider/HeroSlider) və ya `tone` **4 adlı** (Trio/Promo) | şəkil yolları `/assets/*.svg`, `/images/home-2/*`; mətnlər düz (i18n yox) |
| Source | statik `mocks/sections/NN-*.json`; bir hissə section-un default `payload`-ı | | `payload_schema` yoxdur (Q-B2) |

---

## 2. senseihost-front

### 2.1 Topbar — `components/layout/TopBar.tsx` (76 sətir, server komponent)
| Maddə | Dəyər |
|---|---|
| Data | `mocks/nav.ts`: `corporateInfo {phone,email,voen}`, `topLinks: NavItem[]` (blog, faq, contact — 3 ikon sabit `[Rss, MessageSquareText, MapPin]` index üzrə), `ticketLink: NavItem`, `campaignsLink: NavItem`; mətn = next-intl `common.topbar.*`, `common.nav.campaigns` |
| `NavItem` (lib/types) | `{ labelKey: string, href: string, descKey?: string, badgeKey?: string }` |
| Quruluş | tünd zolaq (`bg-dark-deep`, üstdə 3 px `primary` xətt), **sticky deyil**; sol: telefon pill (`tel:`) + 3 link; sağ: `LocaleSwitcher` + `CurrencySwitcher` + ayırıcı + dəstək bileti + «Kampaniyalar» gradient düyməsi |
| Responsive | `hidden xl:block` — `<xl` (<1280) **yoxdur**; linklər `MobileMenu`-nun altına düşür |
| Dil | `locales: ["az","en","tr","ru"]`, default `az`; URL prefiksi `/${locale}` (`localeHref`: yalnız `/` ilə başlayanlara) |
| Variant | yoxdur |

### 2.2 Header — `Header.tsx` (125) + `HeaderShell.tsx` (41) + `Nav.tsx`, `ToolsMenu.tsx`, `MobileMenu.tsx`, `HamburgerPanel.tsx`, `Wordmark.tsx`, `ThemeToggle.tsx`
| Maddə | Dəyər |
|---|---|
| Data | `mocks/nav.ts` (`mainNav`, `toolCategories`, `cartCount`, `whatsappHref`); mətn `common.header.*` |
| Loqo | şəkil: `/img/logo.png` (açıq), `/img/logo-dark.png` (tünd), `/img/logo-light.png` (band/hamburger) — `Wordmark` 3 hal |
| Quruluş (2 hal, avtomatik) | **top**: sətir 1 = loqo + «online/chat» (WhatsApp linki) | sağ klaster (tema, səbət+say, login, register, hamburger, mobil menyu); sətir 2 = tünd nav kapsulu (Nav + Tools açılan + axtarış düyməsi). **stuck** (`IntersectionObserver`): bir sətir kompakt, `bg-bg` + kölgə; hündürlük sabit `h-24 xl:h-44` |
| Responsive | kapsul `hidden xl:flex`; login/register `max-[1279px]:hidden`; `<xl`: `MobileMenu` (tam ekran) |
| Variant | **yoxdur** (yalnız top/stuck hal) |
| Hard-code | `/login`, `/register`, `/cart`, `/search` yolları komponentdə sərt |

### 2.3 Menu / MegaMenu — `Nav.tsx`, `MegaMenu.tsx` (86), `ToolsMenu.tsx`
| Maddə | Dəyər |
|---|---|
| Tip | `NavMenuGroup = { id, labelKey, href?, items?: NavLink[], badgeKey?, accent?: boolean, highlight?: boolean, deal?: {badgeKey,textKey} }`, `NavLink = { labelKey, descKey?, href, icon(lucide adı) }` |
| Quruluş | `mainNav[]`: domain (5 item, badge `premium`), hosting (5), server (5), `n8n` (düz link), `ssl` (düz link), email (2 item), `game` (`highlight`); `navGroups` tam siyahı (footer üçün, id-lər **dəyişməməlidir**: domain, hosting, server, email, company) |
| Mega render | `items.length ≤ 3` → **compact** dropdown (kartlar, `w-80`); əks halda **bento**: sol tünd tile (`items[0]` = lead, ikon+ad+desc) + sağda 2 sütun kartlar (`items[1..]`, IconBox) + `deal` zolağı (Badge + mətn); açılış hover/focus-within, 100 ms gecikmə, `w-[min(60rem,100%)]` |
| Tools | `toolCategories: {id,labelKey,items:NavLink[]}[]` (seo, network, web, code; 4–5 item), `toolsAll: NavLink`; ayrıca açılan panel |
| Mobil | `MobileMenu`: `mainNav` + tools (flatMap) + `topLinks`, `ticketLink`, `campaignsLink`; `<details>` akkordeon |
| Dərinlik | **2 səviyyə** (group→items); 3-cü yoxdur |
| Hamburger | `HamburgerPanel` (xl+): şirkət/hüquqi `nav.company.items.*` açarları (id sərt) |

### 2.4 Footer — `Footer.tsx` (37) + `_FooterColumns/_FooterContact/_FooterSocial/_FooterBottom.tsx`
| Maddə | Dəyər |
|---|---|
| Data | `mocks/nav.ts`: `footerColumns: {id,labelKey}[]` (domain, hosting, server, company→`footer.more`), `footerPills: NavItem[]` (6 hüquqi/yardımçı link), `corporateInfo`, `whatsappHref`; mətn `common.footer.*` |
| Quruluş | Container daxilində yumru kart; grid `xl:[1.5fr_1fr_1fr_1fr_1fr]`: marka sütunu (loqo, `tagline`, əlaqə pill+email+ticket+FAQ, 3 sosial) + 4 link sütunu; sütunda **ilk 6 item**, qalanı `<details>` («daha çox», JS yox); alt bar: `footerPills` + copyright/ƏDV/demo qeydi |
| Sosial | 3 sabit SVG (instagram, x, facebook), `href="#"` sərt |
| Sütun mənbəyi | `navGroups[id].items` (header ilə **ortaq data** — admin-də menyudan türəməlidir) |
| Variant | yoxdur |

### 2.5 Banner / Slider section-ları (`sections-senseihost.generated.md`, `sectionsGallery.ts`)
| Section | Fayl | Data | Qeyd |
|---|---|---|---|
| `hero` → `HeroBento` | `sections/home/HeroBento.tsx` (20) = `_HeroSlider.tsx` + `_PromoBanner.tsx` + `WeeklyDeal` | `mocks/hero.ts`: `heroSlides: {id, img?, href, icon(lucide), priceUsd?, features:[3 lucide adı]}[]` (5: hosting, vds, domain, ssl, trademark); `heroCampaign {href, percent, img, perks:id[]}`; `heroDeal {href,icon,percent,priceUsd,oldPriceUsd}`; mətn `home.hero.slides.<id>.{tab,features.a|b|c}`, `home.hero.campaign.*`, `home.hero.deal.*` | slayder: üstdə seqment tab-lar (mobil üfüqi scroll), avtomatik keçid CSS animasiyası `animate-hero-progress` ilə (hover/focus pauza, reduced-motion-da yox); sağ 4: kampaniya tile (`dark`) + həftənin təklifi (geri sayım həftə sonuna) |
| `promo` → `PromoBand` | `sections/home/PromoBand.tsx` | mətn `home.promo.*` (eyebrow,title,desc, `steps a|b|c`) | tək tünd tile, 3 sütun |
| `heroes/*` (22) | `sections/heroes/*Hero.tsx` | hər xidmət səhifəsinin öz hero-su | **banner/slider deyil**, səhifə hero-ları |
| `blogAnnouncements` | `sections/blog/BlogAnnouncements.tsx` | `blog` namespace | elan zolağı |
| `promoHero/promoGrid/promoDetailHero` | `sections/promotions/*` | `mocks/promotions.ts` (`percent, code, ends(ISO), href`) | kampaniya səhifələri |
| Rəng | — | **hex yoxdur**; yalnız tokenlər (`primary, accent, primary-light, dark, dark-deep, lime, surface, border`) + `mint/blush/sky/amber` ad-slotları (palitra qaydası `CLAUDE.md §2`) | admin ixtiyari rəng icazəsi verməməlidir (`locked_tokens`) |
| i18n | — | mətn = next-intl `messages/{az,en,tr,ru}/*.json` açarı; data faylı yalnız struktur | admin-də çoxdilli sahə **dil üzrə mətn** olmalıdır (açar yox) |

---

## 3. İki front arasındakı fərq (cədvəl)
| Mövzu | xshop-front | senseihost-front |
|---|---|---|
| Layout mənbəyi | `AppShell` → `TopBar`, `MainHeader`, `Footer` (client) | `app/[locale]` layout → `TopBar`, `Header`, `Footer` (server, next-intl) |
| Data | `mocks/header.json`, `footer.json` (**düz mətn**) | `mocks/nav.ts` (**i18n açarları**) + `messages/*.json` |
| i18n | yoxdur (mətn düz; `lang="en"`) | `az/en/tr/ru`, URL prefiksi, default `az` |
| Topbar görünür | `≥md` | `≥xl` (1280) |
| Header | sticky tək, 2 sətir (`lg+`), mobil drawer + **alt tab bar** | top/stuck 2 hal, tünd kapsul nav (`xl+`), mobil tam ekran menyu |
| Menu | düz nav + 1-səv. dropdown + **kateqoriya mega** (emoji ikon, `subCategories: string[]`) | **qrup mega** (lead tile + kartlar + `deal`), `compact` ≤3, lucide ikon, desc, badge/highlight, Tools mega |
| Footer | brand + 3 link sütun (mobil akkordeon) + contact kartı + ödəniş çipləri + app yüklə | brand + əlaqə + 4 link sütun (menyu datasından, 6+ → `<details>`) + 6 pill; ödəniş/app yoxdur |
| Loqo | mətn + dairə (şəkil yox) | 3 şəkil faylı (açıq/tünd/band) |
| Banner rəngi | `bgColor` hex və `tone` 4 ad | yalnız tema tokeni (hex qadağan) |
| Slayder | autoplay JS (`setInterval` 5.5–6 s), sürüklə, `useDraggableSlider` | CSS animasiya ilə segment tab, hover pauza |
| Variant | yox | yox |

---

## 4. Admin form sahələri (blok üzrə) — **yalnız koddan**

Ortaq qayda: mətn sahəsi = **çoxdilli obyekt** `{az,en,tr,ru}` (xshop düz mətn saxlayır, amma admin v2 çoxdilli saxlayıb frontun aktiv dilini verir; senseihost-da i18n açar əvəzinə dil mətni). Link sahəsi = daxili route seçici **və ya** xarici URL. İkon sahəsi: xshop = emoji mətni, senseihost = lucide adı (seçici).

### 4.1 Topbar (`theme.topbar`)
| Sahə | Tip | Mənbə | Tema |
|---|---|---|---|
| `enabled` | bool | `hidden md:block` / `xl:block` (kök üçün) | hər ikisi |
| `support.text` | i18n mətn | xshop `supportText` | xshop |
| `support.phone` | string | `supportPhone` / `corporateInfo.phone` | hər ikisi |
| `languages[]` `{code,label,flag}` + `defaultLanguage` | list | xshop `topBar.languages` | xshop (senseihost: sistem dilləri `Settings → Dillər`-dən) |
| `currencies[]` `{code,symbol,label}` + `defaultCurrency` | list | `topBar.currencies` | hər ikisi (Settings valyutası ilə bağlı) |
| `promoAlert` `{category,discount,period}` | 3 i18n mətn (+ `enabled`) | xshop | xshop |
| `utilityLinks[]` `{label(i18n), href, icon?}` | sıralanan list | xshop `utilityLinks` (5), senseihost `topLinks` (3, ikon index üzrə) | hər ikisi |
| `ticketLink` `{label,href}` | link | senseihost | senseihost |
| `campaignsButton` `{label,href}` | link | senseihost `campaignsLink` | senseihost |
| `style` (tünd/açıq, üst xətt) | token seçimi | senseihost `bg-dark-deep` + `border-primary` | tema tokenindən |

### 4.2 Header (`theme.header`)
| Sahə | Tip | Mənbə |
|---|---|---|
| `logo.light`, `logo.dark`, `logo.band?` | şəkil (`image-picker`) | senseihost 3 fayl; xshop: `logo.text` + `href` |
| `logo.text`, `logo.href` | mətn, link | xshop |
| `search.placeholder` | i18n mətn | xshop |
| `account.label`, `account.actionText` | i18n mətn | xshop |
| `support.label`, `support.phone` | i18n mətn, string | xshop («24/7 Support») |
| `chat` `{label, href(WhatsApp)}` + `onlineText` | i18n mətn, URL | senseihost `whatsappHref` |
| `showSearch / showCart / showWishlist / showLogin / showRegister / showThemeToggle` | bool | hər iki frontda sərt göstərilir (switch əlavə edilir — frontda dəstək **yoxdur**, Q-F2) |
| `sticky` (stuck kompakt rejimi) | bool | senseihost `HeaderShell`; xshop həmişə sticky |
| `variant` | select | **kodda yoxdur** (Q-F1); bir variantla başlamaq |
| `categoriesButtonText` | i18n mətn | xshop |
| `mobile.tabBar[]` | list | xshop alt tab bar (sərt komponent; Q-F2) |
| Menyu bağlantısı | `menu_id` seçimi | §4.3 |

### 4.3 Menu + MegaMenu (ağac redaktoru; drag-drop, 2 səviyyə kifayətdir)
Bir `menu` obyekti (`location`: `header` | `footer` | `mobile` | `tools`). Node:
| Sahə | Tip | Mənbə |
|---|---|---|
| `id` | string | xshop `id`, senseihost `id` (footer üçün **sabit açar**) |
| `label` | i18n mətn | `name` / `labelKey` |
| `href` | route/URL seçici (boş = yalnız qrup) | `href` |
| `icon` | emoji (xshop) / lucide adı (senseihost) | `icon` |
| `description` | i18n mətn | senseihost `descKey` |
| `badge` `{text(i18n), tone: lime|primary-hover|accent}` | obyekt | senseihost `badgeKey`, `accent` |
| `highlight` | bool | senseihost `highlight` (pill) |
| `type` | `link` \| `dropdown` \| `mega-categories` \| `mega-bento` | xshop `hasDropdown` / `CategoryMenu`; senseihost `items≤3` compact / bento |
| `deal` `{badge(i18n), text(i18n)}` | obyekt (yalnız `mega-bento`) | senseihost `deal` |
| `lead` | `items[0]` lead tile (sıra əsaslı, ayrıca sahə yox) | senseihost MegaMenu |
| `children[]` | node (maks 2 səviyyə) | `items` / `subCategories` |
| xshop `subCategories` | `string[]` (href yox) → admin v2-də `children[{label,href?}]`; frontun href-i oxuması üçün front dəyişikliyi lazımdır | Q-F3 |
| `order`, `enabled`, `requires_module?` | int, bool, string | plan 00 |
| `visible_in` | `desktop`/`mobile` | mobil menyu ayrıca render olunur |
| Kateqoriya mega mənbəsi | `source: manual | catalog_categories` | xshop `categories` statikdir; real sistemdə kataloq kateqoriyalarından avtomatik doldurma təklifi (Q-F4) |

### 4.4 Footer (`theme.footer`)
| Sahə | Tip | Mənbə |
|---|---|---|
| `brand.name`, `brand.description` / `tagline` | i18n mətn | hər ikisi |
| `brand.logo` | şəkil | senseihost Wordmark |
| `socials[]` `{network(select), href}` | list | xshop 5 (Facebook, Instagram, LinkedIn, Pinterest, Behance), senseihost 3 (instagram, x, facebook); ikon `network` adı üzrə sərt xəritədir |
| `appDownload` `{title, googlePlay{title,subtitle,href}, appStore{…}}` + `enabled` | obyekt | xshop |
| `columns[]` `{title(i18n), source: manual|menu, menu_id?, links[{label,href}]}` | list | xshop 3 sütun manual; senseihost sütunlar `navGroups`-dan (menu), `visibleCount=6` + «daha çox» |
| `contact` `{title, address, phone, email, fax?}` | mətn | xshop `contact`; senseihost: `corporateInfo {phone,email,voen}` + ticket/FAQ linkləri |
| `paymentMethods[]` | string list (+ `enabled`) | xshop |
| `pills[]` `{label,href}` | list | senseihost `footerPills` (6) |
| `bottomBar.copyright` (i18n), `bottomBar.links[]` | mətn, list | xshop; senseihost: `footer.copyright`, `vatNote`, `demoNote` |
| `showScrollTop` | bool | xshop yuxarı düyməsi |
| `variant` | select | kodda yoxdur (Q-F1) |

### 4.5 Banner / Slider item (Bannerlər və Slayderlər CRUD)
Bir **slider qrupu** = section payload-ının admin tərəfi; hər item:
| Sahə | Tip | Mənbə |
|---|---|---|
| `group` (`hero-slider`, `promo-banners`, `trio`, `dual`, `brand-logos`) | select | xshop section adları |
| `image` | şəkil (+ `alt`) | `image` |
| `badge`, `tag`, `eyebrow`, `title`, `subtitle`, `description`, `ctaText` | i18n mətn | xshop sahələri |
| `ctaLink` | route/URL | `ctaLink` / `href` |
| `bgColor` | rəng (hex; `color-picker`) | xshop `BeautyHeroSlider/HeroSlider` |
| `tone` | select `sage|blush|sky|lavender|amber` | xshop Trio/Promo |
| `badgeBg`, `badgeColor`, `vendorTag`, `price`, `originalPrice` | rəng/mətn/rəqəm | xshop `rightBanners` kartı |
| `icon` (lucide), `priceUsd`, `features[3]` (lucide + i18n mətn) | seçici/rəqəm | senseihost `heroSlides` |
| `percent`, `perks[]`, `img` | rəqəm/list/şəkil | senseihost `heroCampaign` |
| `deal` `{eyebrow,vendor,product_id,stockLeft,stockTotal}` / `{icon,percent,priceUsd,oldPriceUsd,endsAt}` | obyekt | xshop `HeroSlider.deal`; senseihost `heroDeal` (geri sayım həftə sonu) |
| Slider ayarı `autoplay`, `interval(ms)`, `loop`, `pauseOnHover` | bool/int | xshop 5500/6000/4500 ms; senseihost CSS animasiya (interval CSS-də) |
| `order` (drag-drop), `enabled`, `starts_at`, `ends_at`, `locale_visibility[]` | int,bool,datetime,dil list | plan (planlama/dil) — **kodda yoxdur**, API sahəsi kimi |
| Responsive: `image_mobile?` | şəkil | xshop şəkil `hidden sm:flex`; mobil şəkil sahəsi kodda yoxdur (Q-F2) |

Tema qaydası: senseihost temasında `bgColor/tone` göstərilmir, yalnız token seçimi (`locked_tokens`).

### 4.6 Tokenlər (qısa, plan 02 ilə uyğun)
xshop: `font-display`, `font-body` + 4 şrift (`Inter, Quicksand, Poppins, Montserrat` → `layout.tsx`), rəngləri sərt hex (`#7C3AED`, `#4C1D95`, `#F6F1FD`, `#FAF9FC`); senseihost: CSS dəyişənləri/token adları (`primary, accent, primary-light, dark, dark-deep, lime, surface, border, bg, heading, text, muted, inverse`, `--z-header`, `--z-mobile-menu`). → xshop temasını tokenə çevirmək front işidir (Q-F5).

---

## 5. Açıq suallar
| # | Sual | Tövsiyə |
|---|---|---|
| Q-F1 | «Header/Footer variantları» (plan 71, Prompt 03 C4) üçün **iki frontda da kod variantı yoxdur** (yalnız senseihost-un top/stuck halı). Variant seçici UI qurulsun? | v1-də tək «default» variant + `variant` sahəsi bağlı; frontlar variant əlavə edəndə açılır |
| Q-F2 | Frontda dəstəklənməyən göstər/gizlət switch-ləri (search, cart, login…), `image_mobile`, tab bar elementləri | admin-də yalnız koddan çıxan sahələr aktiv; qalanı «frontda dəstək yoxdur» nişanı ilə söndürülü |
| Q-F3 | xshop mega menyusunda alt kateqoriya `string`-dir (href yox) | node `{label,href?}`; front genişlənənə qədər `href` göz ardı olunur |
| Q-F4 | Kateqoriya mega menyusu kataloq kateqoriyalarından avtomatik doldurulsun? | `source: manual|catalog_categories` seçimi |
| Q-F5 | xshop rəngləri sərt hex (token yox) — Themes tokenləri xshop-da tətbiq olunması üçün front refaktoru lazım | tema `token_policy`: xshop = sərbəst, senseihost = `locked_tokens` |
| Q-F6 | Header/Topbar/Footer/Menu **section kataloqunda** deyil: admin bunları tema ayarı kimi saxlayır; `Pages` builder-də header/footer variantı səhifə səviyyəsində (plan 01 §2 #4) seçilməlidirmi? | yox — tema-qlobal, səhifə yalnız «gizlət» override |
| Q-F7 | senseihost mətnləri next-intl açarlarıdır; admin-dən redaktə olunan mətnlər API/DB-dən gələcək → açar əvəzi `{az,en,tr,ru}` mətn; front dəyişikliyi gözlənilir | API cavabı: açar varsa tərcümə, yoxdursa mətn |
| Q-F8 | xshop `homeVariants` (JSON-da var, istifadəsiz) və «Bölmələr (N)» demo qısayolu — admin sahəsi deyil | ignor |
