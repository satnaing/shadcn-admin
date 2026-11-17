/** Locale files under `public/locales/<lng>/` that belong to one `/admin/<segment>` section. */
const SECTION_NAMESPACES = [
  'affiliate', 'ai', 'blogs', 'classified', 'club-point', 'courier', 'map-provider', 'modules',
  'otp', 'pages', 'payments', 'pos', 'preorder', 'qrcode-event', 'refund', 'roles',
  'seller-package', 'settings', 'themes', 'wholesale',
]

/** Namespace of the section a pathname belongs to (`/admin/club-point/config` → `club_point`), if it has one. */
export function namespaceForPath(pathname: string): string | undefined {
  const segment = pathname.split('/')[2]
  return segment && SECTION_NAMESPACES.includes(segment) ? segment.replace(/-/g, '_') : undefined
}

