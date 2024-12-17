import { remixRoutesOptionAdapter } from '@react-router/remix-routes-option-adapter'
import { flatRoutes } from 'remix-flat-routes'

export default remixRoutesOptionAdapter((defineRotue) =>
  flatRoutes('routes', defineRotue),
)
