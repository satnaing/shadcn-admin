import type { PackageFormValues } from '@/features/seller-package/data/seller-package.schema'
import type { SellerPackage } from '@/features/seller-package/data/seller-package.type'
import { createCollection, type Handler } from './helpers'
import { seedPackages } from './seller-package.data'

const packages = createCollection(seedPackages)

const P = '/admin/seller-packages'
const body = <T>(b: unknown) => (b ?? {}) as T
const ok = { message: 'ok' }

const fields = (v: PackageFormValues): Partial<SellerPackage> => ({
  ...v,
  name: v.translations.az,
})

const routes: Record<string, Handler> = {
  [`GET ${P}`]: () => ({ data: packages.all().map((p) => ({ ...p })) }),
  [`POST ${P}`]: ({ body: b }) => ({
    ...ok,
    data: packages.create({
      ...fields(body<PackageFormValues>(b)),
      sellers_count: 0,
    } as Omit<SellerPackage, 'id'>),
  }),
  [`PUT ${P}/:id`]: ({ params, body: b }) => {
    packages.update(params[0], fields(body<PackageFormValues>(b)))
    return ok
  },
  [`DELETE ${P}/:id`]: ({ params }) => {
    packages.remove(params[0])
    return ok
  },
}

export default routes
