# ai — AEC vs v1 vs admin2

Module id `ai` (single module, Prompt 04 table row 10) · AEC core "AI" (Gemini content generation: `AIController`, `AiService`, `BusinessSettingsController@ai_config_update`, `views/backend/setup_configurations/ai_configurations/*`, `views/backend/reports/ai_token_usage`) + addon `ai_translate` (`D:\www\aec\addons\ai_translate` — `routes/ai_translate.php`, `AiTranslateConfigController`, `AiTranslateController`, `views/{config,token_usage,language_page_extras,language_script_addon}.blade.php`). The path `public_html\addons\ai_translate` named in the prompt does not exist; AEC source tree is `D:\www\aec`. v1 source: `admin/src/features/ai-studio` (config form, prompt table, token usage, product generator).
Scope: **admin panel** screens only. Out of scope: the "Generate with AI" buttons inside the product add/edit forms (admin and seller; they belong to the catalog module — only the endpoint contract is noted), the seller-side token balance, and licence/activation code.

Status legend: **tam** (full) · **natamam** (partial) · **yox** (missing). Totals: AEC admin screens **13**; v1 **0 tam / 6 natamam / 7 yox**; admin2 **11 tam / 2 yox by design** (#6, #7, see §4).

## 1. AEC screens (step 1)

| # | Blade / partial | Route | HTTP | Controller@method | Inputs | v1 | admin2 (route / UI) |
|---|---|---|---|---|---|---|---|
| 1 | `ai_configurations/ai_config` ("Google AI (Gemini) Settings") | `/admin/ai-configuration` (`ai-config`, perm `manage_ai_configuration` in the sidebar only) | GET | AIController@ai_configuration | — | natamam (provider/maxTokens/temperature invented) | tam — `/admin/ai` left card (`AiContentCard`) |
| 2 | same form | `/admin/ai-configuration` (`ai_config.update`) | POST | BusinessSettingsController@ai_config_update | `ai_activation` (checkbox), `gemini_model` (select), `GEMINI_API_KEY` (text, required), `seller_monthly_token_limit` (number, required) | natamam | tam — `PUT /admin/ai/settings/content` |
| 3 | `ai_configurations/prompt_templates` | `/admin/ai-templates` (`ai-prompt-templates-config`) | GET | AIController@ai_templates | — (one card per row) | natamam (v1 had create/delete/toggle/targets) | tam — `/admin/ai/prompts` (`AiPromptsPage`) |
| 4 | prompt card "Edit → Save" | `/admin/ai-templates/{id}` (`ai-prompt-templates.update`, id encrypted) | PATCH | AIController@update | `prompt` (required) | natamam | tam — `PUT /admin/ai/prompts/{id}` `{prompt}` (dialog) |
| 5 | `reports/ai_token_usage` ("Token Usage") | `/admin/token-usage` (`ai-token-usege`) | GET | AIController@ai_token_usage | `date` (`d-m-Y to d-m-Y`) | natamam (v1 had `costUsd`, search) | tam — `/admin/ai/usage` (tab "Content generation") |
| 6 | `ai_configurations/add_edit` (two big links: Add product / Edit product, warns when AI is off) | `/admin/ai-add_edit_products` (`ai-add_edit_products`) | GET | AIController@add_edit_products | — | yox | **not built** — a static page of two links to the product screens; belongs to catalog (§4) |
| 7 | "Generate with AI" button in the product form (per section) | `/admin/products/generate-with-ai` (admin) · `/seller/products/generate-with-ai` | POST | ProductController@generateWithAI → `AiService@productGenerateWithAI` | `product_name` (required), `section` ∈ basic-information · product-description · product-seo-meta-tag · product-configuration (required), `lang`, `existing_data` | natamam (v1 standalone generator with tone/keywords) | **not built** — lives in the product form of the catalog module; contract in §3 |
| 8 | addon `config` ("AI Translation Settings") | `/admin/ai-translate/config` (`ai-translate.config`, perm `language_setup`) | GET | AiTranslateConfigController@index | — | yox | tam — `/admin/ai` right card (`AiTranslateCard`) |
| 9 | same form | `/admin/ai-translate/config/update` | POST | AiTranslateConfigController@update (blocked in demo mode) | `ai_translate_activation` (checkbox), `gemini_translate_model` (select), `GEMINI_TRANSLATE_API_KEY` (text, required) | yox | tam — `PUT /admin/ai/settings/translate` |
| 10 | addon `token_usage` ("AI Translation Token Usage") | `/admin/ai-translate/token-usage` (`ai-translate.token-usage`) | GET | AiTranslateConfigController@tokenUsage | `date` | yox | tam — `/admin/ai/usage?kind=translation` |
| 11 | language screen button "Translate By AI" (current page, 50 keys) | `/admin/languages/translations/ai-page/{id}` (GET) · `/admin/ai-translate/translate/{id}` (POST) | GET/POST | AiTranslateController@aiTranslateCurrentPage | `page`, `search` | yox | tam — `POST /admin/ai/translate/{id}` `{engine:'ai', page}` (`AiTranslatePage`) |
| 12 | language screen button "Translate By Google" (current page) | `/admin/languages/translations/google-page/{id}` | GET | AiTranslateController@googleTranslationsPage | `page`, `search` | yox | tam — same endpoint with `engine:'google'` |
| 13 | language screen button "Translate All" (browser loops over every page) | the two routes above, once per page | — | `makeAiTranslationsAll` in `language_script_addon.blade` | — | yox | tam — "Translate empty strings" with progress and a stop button (`useAiTranslateRun`) |

## 2. Field diff (step 4)

| Screen | AEC field | v1 field | admin2 (our name) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| content settings | `ai_activation` | `enabledForVendors` | `content.enabled` | bool | v1 name wrong (it switches AI for everyone) | AEC meaning |
| content settings | `gemini_model` (7 models in 3 optgroups) | `provider` (openai/anthropic/gemini/groq), `model` (free text) | `content.model` ∈ 7 Gemini ids | enum | v1 providers invented; AEC only talks to Gemini | AEC list |
| content settings | `GEMINI_API_KEY` (in `.env`, printed in clear text) | `apiKey` | `content.api_key` (masked `********`) | secret | AEC leaked the key into the HTML | masked, mask = keep |
| content settings | `seller_monthly_token_limit` | `vendorMonthlyTokenLimit` | `content.seller_monthly_token_limit` | int ≥ 0 | AEC unvalidated; saving also overwrites **every** user's remaining limit | hint says so |
| content settings | — | `maxTokens`, `temperature`, `defaultLanguage` | — | — | not in AEC (fixed in `AiService`: temperature 0.7, topP 0.95, maxOutputTokens 1024) | dropped, §4 Q1 |
| translate settings | `ai_translate_activation` | — | `translate.enabled` | bool | | |
| translate settings | `gemini_translate_model` (5 models; retired `gemini-2.0-flash*` silently rewritten) | — | `translate.model` ∈ 5 ids | enum | | API normalises retired ids on read |
| translate settings | `GEMINI_TRANSLATE_API_KEY` | — | `translate.api_key` (masked) | secret | own key, independent of content AI | |
| prompts | `ai_prompts.identifier` (1 seeded row: `product_add_edit_prompt`), `prompt` | `title`, `target`, `template`, `systemInstruction`, `isActive` | `identifier`, `prompt` | text | v1 CRUD model invented | edit only |
| prompts | "N.B: do not change the variables like { ____ }" | — | zod: the set of `{variables}` must equal the original's | rule | AEC only warned | enforced |
| usage (content) | `ai_usage_logs`: `user`, `model`, `prompt_tokens`, `completion_tokens`, `total_tokens`, `created_at` | `feature`, `costUsd`, `user.role` | `created_at`, `user`, `model`, `prompt_tokens`, `completion_tokens`, `total_tokens` | — | v1 cost invented | AEC columns |
| usage (both) | cards: Total Requests, Total Tokens, Avg Tokens/Request (+ Total Translations for translation) | — | `stats.{requests, tokens, avg_tokens, translations}` | — | | server computes over the filtered set |
| usage (both) | `date` = one text `d-m-Y to d-m-Y` | — | `from`, `to` (`YYYY-MM-DD`, two date inputs) | date | | |
| usage (translation) | `ai_translate_usage_logs`: + `language`, `translated_count` | — | `language`, `translated_count` | — | | |
| translate | language screen (50 keys per page, buttons on one language) | — | `GET /admin/ai/translate/languages` → `{id, code, name, total_keys, translated_keys}`; `POST /admin/ai/translate/{id}` `{engine, page}` → `{state, translated_count, page, total_pages}` | — | one place instead of per-language buttons; coverage bar | |
| translate | `result:false` + message when the addon / switch / key is missing (HTTP 200) | — | `state` ∈ `ok` · `disabled` · `no_key` | enum | | UI shows a localised reason and stops |

## 3. AEC defects fixed (not copied)

| # | AEC behaviour | admin2 |
|---|---|---|
| 1 | Both API keys are rewritten into `.env` (`overWriteEnvFile`: `str_replace` on the current value — a changed or missing key appends duplicates, a `"` in the value corrupts the file) and **printed in clear text** into the form | keys are API data, validated, masked on read; the API should store them encrypted outside `.env` |
| 2 | `ai_config_update` and the prompt update have no permission middleware (`AIController` only guards `google_analytics`) | writes need `ai.settings_manage` / `ai.prompts_manage`; the translate screen needs `ai.translate` (AEC: `language_setup`) |
| 3 | `ai_config_update` calls `->value` on a row that may not exist (`BusinessSetting::where(...)->first()` is not null-checked) | the API upserts |
| 4 | `seller_monthly_token_limit` and the model are not validated; any text goes into `gemini_model` | model ∈ list, limit whole number ≥ 0 |
| 5 | Saving the limit resets `seller_monthly_token_limit` of **every** user (also admins and customers) and stamps `…_setup_date` | hint under the field; the API should update sellers only |
| 6 | The prompt can lose its `{variables}` (only a red note) — `AiService` would then send a broken prompt | variables must be identical |
| 7 | `AiService`: when the monthly limit is exhausted the answer is `success:false` but the call is not logged; for sellers the remaining limit is decremented after the call, so concurrent calls overspend | API must reserve tokens atomically (§4 Q3) |
| 8 | Translation: three queries per key (`first`, `exists`, `stillEmpty`) → ≥150 queries per 50-key page | the API should fetch the page's existing rows once and upsert in one statement |
| 9 | "Translate All" loops in the browser with a fixed pause and no way to stop; one failed page only shows a toast | per-language run with live page progress, **stop** button and a "failed → run again" result (idempotent: only empty strings are filled) |
| 10 | Retired Gemini models stay selectable in old installs until a request rewrites them | the API rewrites them on read, the select lists only current models |
| 11 | Content AI and translation show the same "Select AI Model" label; the help text of the translation card still mentions "Gemini 2.0 Flash Experimental" | separate cards, current model names |

**Contract for the product form (screen #7, catalog module):** `POST /admin/ai/generate` `{product_name, section, lang, existing_data?}` → `{data: {<fields of the section>}, usage: {prompt_tokens, completion_tokens, total_tokens}}`; errors: limit reached, AI off, empty name/section, invalid section, empty/invalid AI answer. Not mocked here because nothing in this module calls it.

## 4. Open questions

1. v1 had `maxTokens`, `temperature` and a default language per provider. AEC hard-codes them (0.7 / 0.95 / 1024). Expose them as real settings, or leave them fixed?
2. The "Add / Edit product with AI" hub (#6) is two links. Drop it for good, or keep a dashboard card in the catalog module that shows the AI on/off state and links to the product forms?
3. The seller token limit: the API must reserve tokens atomically and write the log in the same transaction (AEC decrements after the response). Confirm.
4. Who migrates the existing `GEMINI_API_KEY` / `GEMINI_TRANSLATE_API_KEY` values from `.env` to the encrypted store?
5. The translation addon tracks one total per request (`total_tokens`) but no cost; v1 showed an estimated USD cost. Add a price table to settings, or leave cost out?
6. The language screen itself is a core "Settings" section; its "Translate" buttons are replaced by `/admin/ai/translate`. Should the language screen link here when the AI module is enabled?
7. Mock registers the module enabled so it can be looked at; the sidebar plan implies AI is off until a key is configured. Change the seed?
