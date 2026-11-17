# Shared components (`src/components/shared/`, Prompt 06)

Status: **TagInput, EntityPicker, MediaPicker done.** RichTextEditor and MapPicker are **not built** — they need `@tiptap/*` and `leaflet`/`react-leaflet`, and the package install was refused by the permission layer in this session (see "Blocked").

## TagInput — `shared/tag-input.tsx` (+ `tag-input.logic.ts`, RHF: `forms/form-tag-field.tsx`)
Chips input. Enter / comma / blur adds, Backspace on empty removes the last, × removes one. Case-insensitive duplicate check, `maxLength` (default 50), `maxTags`.
```tsx
<TagInput value={['red']} onChange={setTags} maxTags={10} />
<FormTagField form={form} name='tags' label={t('form.tags')} />   // form value stays "a, b, c"
```
Used by: wholesale form tags, blog tags. i18n: `common:tagInput.{remove,empty,duplicate,tooLong,tooMany}`.

## EntityPicker — `shared/entity-picker.tsx` (+ `entity-picker.logic.ts`)
Async single/multi picker: debounced `fetcher(q)` (react-query), result list, chosen entries as removable chips. Options are `{id, label, hint?}`; the caller owns `selected`.
```tsx
<EntityPicker multiple queryKey={['otp','recipients']} minChars={2}
  fetcher={async (q) => (await api.search(q)).data.map(r => ({ id: r.id, label: r.name, hint: r.email }))}
  selected={chosen} onChange={setChosen} />
```
Used by: OTP bulk-SMS recipients (`OtpRecipientPicker`), wallet recharge customer (`PaymentsCustomerPicker`). Not yet used: page-builder Source tab (the ids field stays a comma list until the catalog lookups exist — S6), preorder category/brand lookups and POS lookups (they are small fixed lists, `FormSelectField` is the right control). i18n: `common:entityPicker.{search,noResults,remove}`.

## MediaPicker — `shared/media/` (`media-picker.tsx`, `media-library-dialog.tsx`, `media.logic.ts`, `use-media.ts`; RHF: `forms/form-media-field.tsx`)
Value is `MediaRef[]` = `{id, url, name, type: 'image'|'document', size}`. Props: `multiple`, `accept: 'image'|'file'|'any'`, `max`, `disabled`. Thumbnails with drag-sort (dnd-kit) in multi mode, "Choose from library" dialog (search, upload, delete, select), PDF/file mode shows a file tile.
```tsx
<MediaPicker value={refs} onChange={setRefs} multiple accept='image' max={8} />
<FormMediaField form={form} name='gallery' label='Gallery' multiple />
```
Single-image forms keep a URL string: `ImagePicker` (`components/image-picker`) now renders a single `MediaPicker` plus the old URL input, so every existing `FormImageField` / `ImagePicker` use (seller-package logo, payments methods/payout logos, qr banner + prize, courier/blog cover, refund sticker, themes, page-builder image fields) uses the library without schema changes.
API: `GET /admin/media?q&type&page`, `POST /admin/media` (multipart `file`) → `{data: MediaRef}`, `DELETE /admin/media/:id` (`api/modules/media.api.ts`, mock `mocks/media.routes.ts`, 18 images + 3 PDFs). Upload URLs in the mock are blob URLs (valid for the tab's lifetime only). i18n: `media:{search,upload,library.*,picker.*}`.
No form has a multi-image gallery or PDF spec field yet (preorder / wholesale have only a thumbnail) — `FormMediaField multiple` is ready for them but adding the fields needs schema + API fields, which this task does not define.

## Blocked
| Component | Needs | State |
|---|---|---|
| RichTextEditor (TipTap) | `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm`, extension-link / image / placeholder / character-count | not built |
| MapPicker (Leaflet) | `leaflet`, `react-leaflet`, `@types/leaflet` | not built |
Both were approved in the prompt, but `pnpm add` was denied by the sandbox permission layer. After the packages are added: RichTextEditor goes into `shared/rich-text/` (use `MediaPicker` for the image button; sanitize the HTML output on change), MapPicker lazy-loaded from `shared/map/` (settings from `GET /admin/map-provider/settings`, OSM default).

## Other changes in this task
- Dev mock persistence: `mocks/persist.ts` — collections survive a hard reload in dev (sessionStorage, keyed by creation order); `?mockReset=1` clears; disabled in tests/production. Non-collection mock state (e.g. module toggles, settings objects) is not persisted.
- `/admin` route `beforeLoad` preloads the section's i18n namespace (`shared/i18n/route-namespaces.ts`): no raw-key flash.
- Seller seed: no `classified.packages*`, no wholesale in-house / sellers lists (`mocks/auth.ts`, test `mocks/auth.node.test.ts`).
