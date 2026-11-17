import { createCollection, paginate, type Handler } from './helpers'
import type { MediaRef } from '@/components/shared/media/media.type'
import { kindOf } from '@/components/shared/media/media.logic'

const images: MediaRef[] = Array.from({ length: 18 }, (_, n) => ({
  id: n + 1, url: `https://picsum.photos/seed/media${n + 1}/480/320`, name: `photo-${n + 1}.jpg`, type: 'image', size: 80_000 + n * 7_000,
}))
const docs: MediaRef[] = ['spec-sheet.pdf', 'price-list.pdf', 'catalogue.pdf'].map((name, i) => ({
  id: 19 + i, url: `https://example.test/files/${name}`, name, type: 'document', size: 240_000 + i * 90_000,
}))
const files = createCollection<MediaRef>([...images, ...docs])
const P = '/admin/media'

const upload: Handler = ({ body }) => {
  const file = body instanceof FormData ? body.get('file') : null
  if (!(file instanceof File)) return { data: null }
  const type = kindOf(file.type)
  // The mock keeps the blob URL for the tab's lifetime only; the real API stores and returns a public URL.
  return { data: files.create({ url: URL.createObjectURL(file), name: file.name, type, size: file.size }, 'start') }
}

export default {
  [`GET ${P}`]: (ctx) =>
    paginate(() => files.all().filter((f) => !ctx.query.type || f.type === ctx.query.type).map((f) => ({ ...f })))(ctx),
  [`POST ${P}`]: upload,
  [`DELETE ${P}/:id`]: ({ params }) => {
    files.remove(params[0])
    return { message: 'ok' }
  },
} as Record<string, Handler>
