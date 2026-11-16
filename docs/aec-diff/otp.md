# otp — AEC vs v1 vs admin2

Module id `otp` · AEC addon `otp_system` (source: `D:\www\aec\addons\otp_system` — `routes/otp.php`, `controllers/OTPController.php`, `SmsController.php`, `SmsTemplateController.php`, `views/otp_systems/{configurations,sms}/*`; the path `public_html\addons\otp_system` named in the prompt does not exist). v1 source: `admin/src/features/otp` (login-config form, gateway cards, template table).
Scope: **admin panel** screens only. Out of scope: the customer/public flow (`OTPVerificationController`: send / resend / validate OTP, guest and purchase OTP modals, `views/otp_systems/frontend/*`) and `SmsUtility` / provider classes (backend). Staff permissions in AEC: `otp_configurations`, `sms_templates`, `send_bulk_sms`, `sms_providers_configurations` (declared in the sidebar `@canany` but guards nothing).

Status legend: **tam** (full) · **natamam** (partial) · **yox** (missing). Totals: AEC admin screens **8** (4 pages + 4 write actions); v1 **0 tam / 3 natamam / 5 yox**; admin2 **8 tam**.

## 1. AEC screens (step 1)

| # | Blade / partial | Route | HTTP | Controller@method | Inputs | v1 | admin2 (route / UI) |
|---|---|---|---|---|---|---|---|
| 1 | `configurations/login_configuration` ("OTP System Settings", 3 cards) | `/admin/otp-login-configuration` (`otp.login_configuration`) | GET | OTPController@loginConfigure (no permission middleware) | — | natamam (6 invented switches + 3 timing numbers) | tam — `/admin/otp` (`OtpSettingsPage`) |
| 2 | …same, switch `onchange` | `/admin/business-settings/update/activation` (`business_settings.update.activation`, core controller) | POST | BusinessSettingsController@updateActivationSettings | `type` ∈ `login_with_otp` · `guest_checkout_with_otp` · `admin_controll_cod_and_wallet_payment_with_otp`, `value` 0/1 | natamam | tam — `PUT /admin/otp/settings` `{login_with_otp?, guest_checkout_with_otp?, cod_wallet_otp?}` |
| 3 | `configurations/index` + 9 `partials/*` ("OTP Configurations": one card per provider) | `/admin/otp-configuration` (`otp.configconfiguration`) | GET | OTPController@configure_index (`otp_configurations`) | — | natamam (5 invented providers: sms_az, twilio, vonage, infobip, fast2sms) | tam — `/admin/otp/gateways` (`OtpGatewaysPage`, one `OtpGatewayCard` per provider) |
| 4 | provider switch | `/admin/otp-configuration/update/activation` (`otp_configurations.update.activation`) | POST | OTPController@updateActivationSettings | `type` (provider), `value` | natamam | tam — `PUT /admin/otp/gateways/{key}/activation` `{active}` |
| 5 | provider credentials form | `/admin/otp-credentials-update` (`update_credentials`) | POST | OTPController@update_credentials → `overWriteEnvFile` | `types[]` + one value per env name (see §2) | natamam | tam — `PUT /admin/otp/gateways/{key}` `{credentials}` |
| 6 | `configurations/sms_templates` (vertical pills, one form per template) | `/admin/sms-templates` (`sms-templates.index`) | GET | SmsTemplateController@index (`sms_templates`) | — | natamam (fake `name`, `availableTags`) | tam — `/admin/otp/templates` (`OtpTemplatesPage`: table + edit dialog) |
| 7 | template form | `/admin/sms-templates/{id}` (`sms-templates.update`) | PATCH | SmsTemplateController@update | `body`, `template_id`, `status` (not for the 3 always-sent) | natamam | tam — `PUT /admin/otp/templates/{id}` `{body, template_id, active}` |
| 8 | `sms/index` ("Send Bulk SMS") | `/admin/sms` (`sms.index`) · POST `/admin/sms-send` (`sms.send`) | GET · POST | SmsController@index, @send (`send_bulk_sms` on index only) | `user_phones[]`, `content`, `template_id` | yox | tam — `/admin/otp/bulk-sms` (`OtpBulkSmsPage`), `GET /admin/otp/recipients?q=`, `POST /admin/otp/sms` |

## 2. Field diff (step 4)

| Screen | AEC field | v1 field | admin2 (our name) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| settings | `login_with_otp`, `guest_checkout_with_otp`, `admin_controll_cod_and_wallet_payment_with_otp` (business settings) | `otpLoginEnabled`, `phoneVerificationOnSignup`, `emailVerificationOnSignup`, `orderPlacementOtpVerification`, `passwordResetViaOtp`, `vendorSignupPhoneVerification` | `login_with_otp`, `guest_checkout_with_otp`, `cod_wallet_otp` | bool | v1: 5 of 6 switches do not exist in AEC | v1 fields dropped |
| settings | — | `otpLength`, `otpExpirySeconds`, `resendIntervalSeconds` | — | int | not in AEC (code length and expiry are hard-coded) | dropped; open question 1 |
| gateways | `otp_configurations.type` (9 rows): `twillo`, `nexmo`, `fast2sms`, `mimo`, `mimsms`, `msegat`, `sparrow`, `ssl_wireless`, `zender` | `provider` ∈ sms_az, twilio, vonage, infobip, fast2sms | `key` (`twilio` spelling fixed) | enum | v1 providers invented | AEC providers |
| gateways | `value` (0/1; turning one on turns every other off) | `status` | `active` | bool | same rule | server-side exclusive |
| gateways | twilio: `TWILIO_SID`*, `TWILIO_AUTH_TOKEN`*, `VALID_TWILLO_NUMBER`, `TWILLO_TYPE` (1 SMS / 2 WhatsApp) | `apiKey`, `apiSecret`, `senderId` | `sid`*, `auth_token`*🔒, `number`, `channel` (`sms`/`whatsapp`) | text / enum | numeric enum → named | |
| gateways | nexmo: `NEXMO_KEY`*, `NEXMO_SECRET`*, `NEXMO_SENDER_ID`* | — | `key`*, `secret`*🔒, `sender_id`* | text | | |
| gateways | fast2sms: `AUTH_KEY`*, `ENTITY_ID`, `ROUTE`* (`dlt_manual`/`p`/`t`), `LANGUAGE`* (`english`/`unicode`), `SENDER_ID` | — | `auth_key`*🔒, `entity_id`, `route`*, `language`*, `sender_id` | text / enum | | |
| gateways | mimo: `MIMO_USERNAME`*, `MIMO_PASSWORD`*, `MIMO_SENDER_ID`* | — | `username`*, `password`*🔒, `sender_id`* | text | | |
| gateways | mimsms: `MIM_USER_NAME`*, `MIM_API_KEY`*, `MIM_SENDER_ID`* | — | `user_name`*, `api_key`*🔒, `sender_id`* | text | | |
| gateways | msegat: `MSEGAT_API_KEY`*, `MSEGAT_USERNAME`*, `MSEGAT_USER_SENDER`* | — | `api_key`*🔒, `username`*, `user_sender`* | text | | |
| gateways | sparrow: `SPARROW_TOKEN`*, `MESSGAE_FROM`* (typo) | — | `token`*🔒, `message_from`* | text | typo fixed | |
| gateways | ssl_wireless: `SSL_SMS_API_TOKEN`*, `SSL_SMS_SID`*, `SSL_SMS_URL` | — | `api_token`*🔒, `sid`*, `url` (URL) | text / URL | URL not validated in AEC | zod URL check |
| gateways | zender: `ZENDER_SITEURL`*, `ZENDER_APIKEY`*, `ZENDER_SERVICE` (1/2), `ZENDER_WHATSAPP`, `ZENDER_DEVICE`, `ZENDER_GATEWAY`, `ZENDER_SIM` (1/2) | — | `site_url`* (URL), `api_key`*🔒, `service`, `whatsapp`, `device`, `gateway`, `sim` | text / enum | hints kept | |
| gateways | `value="{{ env(...) }}"` printed in clear text in the page | — | secrets (🔒) come back as `********`; the mask sent back unchanged keeps the stored secret | — | AEC leaked every key into the HTML | masked |
| templates | `identifier` (10 rows), `sms_body`, `template_id`, `status` | `name`, `content`, `availableTags`, `status` | `identifier`, `body`, `template_id`, `active`, `required` (3 always-sent: `phone_number_verification`, `password_reset`, `account_opening`) | — | v1 `name`/`availableTags` invented | AEC rows |
| templates | "Do not change `[[variables]]`" printed under the textarea | — | zod: the set of `[[variables]]` must equal the original's | rule | AEC did not enforce it | enforced |
| bulk SMS | `user_phones[]` (every user loaded into one `<select>`), `content`, `template_id` | — | `phones[]` (≥ 1, ≤ 500), `content` (≤ 1000), `template_id` (≤ 60); recipients searched on the server (`?q=`, 2 characters minimum, 20 results) | — | all users loaded at once | server search |

## 3. AEC defects fixed (not copied)

| # | AEC behaviour | admin2 |
|---|---|---|
| 1 | `update_credentials` rewrites the `.env` file with `str_replace` on the *current* env value: a changed or missing key appends duplicate lines, a value containing `"` corrupts the file, and nothing is validated | credentials are API data (`PUT /admin/otp/gateways/{key}`), validated per field; the API should store them encrypted outside `.env` |
| 2 | `configure_index` prints every secret (`env('AUTH_KEY')`, passwords, tokens) in the HTML | secrets are masked in the response |
| 3 | `updateActivationSettings` and `update_credentials` have **no permission middleware** (only `configure_index` is guarded) | write routes need `otp.settings_manage` / `otp.gateways_manage` / `otp.templates_manage` |
| 4 | A provider can be switched on with empty credentials (every field is `required` only in the browser) | the switch stays disabled until all required credentials are stored; the API must refuse too |
| 5 | `SmsController@index` loads `User::all()` into the page | server-side recipient search |
| 6 | `SmsController@send` loops over phones with no limit, no validation (`content` / `user_phones` may be empty) and redirects to the dashboard | ≥ 1 recipient, ≤ 500, text required, result `{sent}` and a toast |
| 7 | `SmsTemplateController@update` does not validate (`$request->body` may be null → empty SMS) and strips `\r\n` from the body | body required, ≤ 1000, variables fixed; line breaks kept |
| 8 | `MESSGAE_FROM` typo, numeric `1`/`2` for SMS/WhatsApp and SIM | named values (`sms`/`whatsapp`); the API maps them to the provider's own codes |

## 4. Open questions

1. v1 had OTP length / expiry / resend interval settings; AEC hard-codes them. Add them as real settings (and where does the customer flow read them) or leave them out?
2. Credentials live in `.env` in AEC. The real API needs a store for them (encrypted settings table); who migrates the existing `.env` values?
3. `sms_providers_configurations` permission appears in AEC's sidebar but guards nothing. The module uses `otp.gateways` / `otp.gateways_manage` for it.
4. The customer-side OTP flow (send / verify / resend, 3 views per auth layout) is not an admin screen; it belongs to the storefront / API plan.
5. Bulk SMS sends through the **active** provider only; with none active the API should answer an error (the mock always succeeds).
6. Template `template_id` is meaningful only for Fast2SMS DLT; keep it on every template (AEC) or only show it when Fast2SMS is the active provider?
7. The mock registers the module enabled so it can be looked at; `00-sidebar-architecture.md` implies OTP is off by default until an SMS provider is configured. Change the seed?
