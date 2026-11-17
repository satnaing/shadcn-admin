const TAGS = new Set(['p', 'br', 'h2', 'h3', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'a', 'img', 'blockquote'])
const ATTRS: Record<string, string[]> = { a: ['href', 'target', 'rel'], img: ['src', 'alt'] }

/** http(s), mailto and relative URLs only — blocks `javascript:` / `data:` and the like. */
export const isSafeUrl = (url: string): boolean => {
  // eslint-disable-next-line no-control-regex
  const u = url.trim().replace(/[\u0000- ]/g, '')
  return /^(https?:\/\/|mailto:|\/|#)/i.test(u) || !/^[a-z][a-z0-9+.-]*:/i.test(u)
}

/** Empty editor output (`<p></p>`) counts as no content. */
export const isEmptyHtml = (html: string): boolean => html.replace(/<(?!img\b)[^>]*>|&nbsp;|\s/gi, '') === ''

/**
 * Allow-list sanitizer for editor output (browser only: needs DOMParser).
 * Unknown tags are unwrapped (text kept), script/style/iframe are dropped, attributes are filtered, unsafe URLs removed.
 */
export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const walk = (node: Element) => {
    for (const child of Array.from(node.children)) {
      const tag = child.tagName.toLowerCase()
      if (tag === 'script' || tag === 'style' || tag === 'iframe') {
        child.remove()
        continue
      }
      walk(child)
      if (!TAGS.has(tag)) {
        child.replaceWith(...Array.from(child.childNodes))
        continue
      }
      for (const attr of Array.from(child.attributes)) {
        const ok = (ATTRS[tag] ?? []).includes(attr.name) && (!['href', 'src'].includes(attr.name) || isSafeUrl(attr.value))
        if (!ok) child.removeAttribute(attr.name)
      }
      if (tag === 'a' && child.getAttribute('target') === '_blank') child.setAttribute('rel', 'noopener noreferrer')
    }
  }
  walk(doc.body)
  return doc.body.innerHTML
}
