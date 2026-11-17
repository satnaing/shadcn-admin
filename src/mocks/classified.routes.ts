import type { PackageFormValues } from '@/features/classified/data/classified.schema'
import type { ClassifiedPackage } from '@/features/classified/data/classified.type'
import { seedPackages, seedProducts } from './classified.data'
import { createCollection, type Handler, paginate } from './helpers'

const products = createCollection(seedProducts)
const packages = createCollection(seedPackages)

const P = '/admin/classified'
const body = <T>(b: unknown) => (b ?? {}) as T
const ok = { message: 'ok' }
// paginate() is typed for loose records; rows are cloned so React Query sees changes after in-place writes
const rows = <T extends object>(fn: () => T[]) =>
  (() => fn().map((r) => ({ ...r }))) as unknown as () => Record<
    string,
    unknown
  >[]

const packageFields = (v: PackageFormValues): Partial<ClassifiedPackage> => ({
  name: v.translations.az,
  translations: v.translations,
  amount: v.amount,
  product_upload: v.product_upload,
  logo: v.logo,
})

const routes: Record<string, Handler> = {
  [`GET ${P}/products`]: (ctx) => paginate(rows(() => products.all()))(ctx),
  [`PATCH ${P}/products/:id`]: ({ params, body: b }) => {
    products.update(params[0], {
      is_published: !!body<{ is_published: boolean }>(b).is_published,
    })
    return ok
  },
  [`DELETE ${P}/products/:id`]: ({ params }) => {
    products.remove(params[0])
    return ok
  },
  [`POST ${P}/products/delete`]: ({ body: b }) => {
    for (const id of body<{ ids?: number[] }>(b).ids ?? []) products.remove(id)
    return ok
  },

  [`GET ${P}/packages`]: () => ({
    data: packages.all().map((p) => ({ ...p })),
  }),
  [`POST ${P}/packages`]: ({ body: b }) => ({
    ...ok,
    data: packages.create(
      packageFields(body<PackageFormValues>(b)) as Omit<ClassifiedPackage, 'id'>
    ),
  }),
  [`PUT ${P}/packages/:id`]: ({ params, body: b }) => {
    packages.update(params[0], packageFields(body<PackageFormValues>(b)))
    return ok
  },
  [`DELETE ${P}/packages/:id`]: ({ params }) => {
    packages.remove(params[0])
    return ok
  },
}

export default routes
