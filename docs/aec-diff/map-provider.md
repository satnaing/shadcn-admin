# map-provider — AEC vs v1 vs admin2

Module id `map-provider` · AEC addon `map_provider` 1.0 · source: `D:\www\aec\addons\map_provider` (`config.json`, `controllers/MapProviderController.php`, `views/admin_google_map.blade.php`, `views/google_map.blade.php`, `views/delivery_boy_configure.blade.php`, `views/seller_shop.blade.php`, `scripts/apply.php`, README) and the live tree `D:\www\prielaz\priel-az` (`routes/admin.php` 398/415, `BusinessSettingsController@google_map|google_map_update|overWriteEnvFile`, sidenav block in `backend/inc/admin_sidenav.blade.php`) · v1 **none** (no feature, no route) · admin2 `src/features/map-provider` (1 route).
`public_html` does not exist; `xshop\task\api\aec\` has no file for this addon.
Scope: admin panel only. The drop-in partial `frontend/partials/google_map.blade.php` (Leaflet / Google / Yandex rendering and Nominatim search), the public `GET map-provider/resolve-location` endpoint, the customer address forms, the seller shop form, the delivery-boy configuration map and the pickup-point map belong to the storefront / API / seller panel / `courier` module / shipping. `google-one-tap` is not part of this target.

Status legend: **tam** · **natamam** · **yox**. Totals: AEC admin screens **4**; v1 **0 tam / 0 natamam / 4 yox**; admin2 **3 tam / 1 natamam / 0 yox** (the default-location card has no interactive map: latitude and longitude are typed, see §2).

## 1. AEC screens (step 1)

Route prefix `admin`, middleware `auth` + `admin`; staff permission `google_map_setting` guards the page only (`BusinessSettingsController` constructor). The sidebar item shows while the `map_provider` addon is active (module toggle in admin2).

| # | Blade | Route | HTTP | Controller@method (permission) | v1 | admin2 (route / UI) |
|---|---|---|---|---|---|---|
| 1 | `setup_configurations/google_configuration/google_map` ("Map Setting" card + default-location card) | `/google-map` (`google-map.index`) | GET | BusinessSettingsController@google_map (`google_map_setting`) | yox | tam — `/admin/map-provider` |
| 2 | same page, "Map Setting" form (switch, provider, 3 keys) | `/google-map` (`google-map.update`) | POST | BusinessSettingsController@google_map_update (**no permission**) | yox | tam — card form, `PUT /map-provider/settings` |
| 3 | "Map Configuration Notes" card (3 static hints) | – | – | – | yox | tam — replaced by the field hints / OSM no-key note |
| 4 | same page, "Default Location Setting" card (search box + map + readonly lat/lng), only while the map switch is on | `/business-settings/update` (`business_settings.update`) | POST | BusinessSettingsController@update (**no permission**) | yox | natamam — card form, `PUT /map-provider/location` (typed coordinates, no map) |

## 2. Field / behaviour diff

| Screen | AEC field / behaviour | v1 | admin2 (our name) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| 1 | page opens only while the addon is on; `CoreComponentRepository` licence calls on open | – | `ModuleGuard('map-provider')` + `map_provider.index` | – | licence calls are out of scope | dropped |
| 2 | `google_map` checkbox (`business_settings.google_map` 0/1) | – | `enabled` switch | boolean | – | kept |
| 2 | `MAP_PROVIDER` select `osm\|maptiler\|google\|yandex` (default `osm` when empty); stored in `.env` | – | `provider` select | enum | AEC accepted any posted value | tightened: enum |
| 2 | `MAP_API_KEY` (Google key, text, shown in clear) | – | `google_api_key` password field, masked `********` | string ≤ 255 | key readable by anyone who opens the page and in page source | fixed: mask contract (§3) |
| 2 | `MAPTILER_KEY` | – | `maptiler_key`, masked | string ≤ 255 | same | fixed |
| 2 | `YANDEX_MAP_KEY` | – | `yandex_key`, masked | string ≤ 255 | same | fixed |
| 2 | all three key fields always shown | – | only the key of the chosen provider is shown; OpenStreetMap shows "needs no key" | – | the other two keys keep their stored value and are still sent | changed (less clutter) |
| 2 | no check that the chosen provider has its key (the picker then fails on the storefront) | – | the chosen provider's key is required while the map is on (`osm` needs none) | – | AEC saved an unusable setup silently | fixed |
| 2 | `types[]` hidden inputs: the controller loops `$request->types` and writes `.env` for **any** name posted (arbitrary `.env` key write); no permission check on the POST; `file_put_contents` on `.env`; `DEMO_MODE` check only | – | fixed field set; write needs `map_provider.manage`; API stores the keys encrypted, not in `.env` | – | AEC security hole: any admin-routed user can overwrite any `.env` value | fixed in contract |
| 2 | `overWriteEnvFile` uses `str_replace` on the whole file (a key that is a substring of another matches the wrong line) | – | – | – | fragile | gone with the `.env` writes |
| 2 | `Artisan::call('cache:clear')` + flash | – | query refetch + toast | – | – | kept |
| 3 | notes: enable map → pick provider (OSM needs no key) → set default location | – | field hints | – | – | folded into the form |
| 4 | search box + map picker writes `google_map_latitude`, `google_map_longtitude` (typo kept in AEC) into two readonly inputs → `business_settings` rows | – | `latitude`, `longitude` text inputs, both or none, −90…90 / −180…180 | number\|null | AEC saved readonly text with no range check and no permission check; map preview needs Leaflet (no new package) | **missing: interactive map / search** (open question 1) |
| 4 | card visible only while `google_map == 1` | – | same: shown while `enabled` | – | – | kept |
| 4 | the same `business_settings.update` form is shared with every other setting (it accepts any `types[]` name) | – | dedicated `PUT /map-provider/location` | – | AEC mass-assignment of settings | fixed in contract |

## 3. API contract used by the mock (`/admin/map-provider/*`)

| Call | Body / query | Response |
|---|---|---|
| `GET /settings` | – | `{data: {enabled, provider, google_api_key, maptiler_key, yandex_key, latitude, longitude}}` — non-empty keys come back as `********` |
| `PUT /settings` | `{enabled, provider, google_api_key, maptiler_key, yandex_key}`; a key equal to `********` means "unchanged" | `{message}` |
| `PUT /location` | `{latitude: number\|null, longitude: number\|null}` (both or none) | `{message}` |

The API must repeat the checks: provider enum, the chosen provider's key required while enabled, coordinate ranges, write permission `map_provider.manage`.

## 4. Open questions
1. The default location needs an interactive picker (search + draggable marker). It needs a map component (Leaflet / provider SDK); a new package needs a stated reason and PM approval. Typed coordinates are the stand-in. Add Leaflet for this card (and later for courier pickup / address forms)?
2. Real API must keep the three keys encrypted in the database, not in `.env`; who migrates the existing `MAP_API_KEY`, `MAPTILER_KEY`, `YANDEX_MAP_KEY` values?
3. The public `GET /map-provider/resolve-location?country_id=&q=a|b` (geocoder name → `state_id` / `city_id`, "contains" match both ways, no auth, raw `LIKE` input) belongs to the storefront API; the plan must list it (storefront address forms depend on it).
4. Courier configuration, pickup-point forms and the seller shop form embed the same map partial; when those modules read the provider they need `GET /map-provider/settings` (public subset: provider, public key, default location) — keys of the admin endpoint stay masked.
5. AEC's `km_based` shipping type is offered only when `delivery_boy` and `map_provider` are both active; the shipping/courier modules need this dependency (the module toggle does not model it yet).
6. The mock registers the module as active; `00-sidebar-architecture.md` says addon modules are off by default. Change the seed?
