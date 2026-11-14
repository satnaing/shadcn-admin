import type { MenuNode } from './themes.type'

/** Menus are 2 levels deep (front-analysis §4.3). */
export const MAX_DEPTH = 2

export const makeNode = (id: string): MenuNode => ({
  id,
  label: {},
  href: '',
  icon: '',
  description: {},
  badge: null,
  highlight: false,
  type: 'link',
  deal: null,
  source: 'manual',
  visibleIn: 'both',
  enabled: true,
  children: [],
})

export const findNode = (tree: MenuNode[], id: string): MenuNode | undefined => {
  for (const node of tree) {
    if (node.id === id) return node
    const hit = findNode(node.children, id)
    if (hit) return hit
  }
  return undefined
}

/** Id of the node's parent list owner; `null` for the root list. `undefined` if missing. */
export const parentOf = (tree: MenuNode[], id: string, parent: string | null = null): string | null | undefined => {
  for (const node of tree) {
    if (node.id === id) return parent
    const hit = parentOf(node.children, id, node.id)
    if (hit !== undefined) return hit
  }
  return undefined
}

export const updateNode = (tree: MenuNode[], id: string, patch: (node: MenuNode) => MenuNode): MenuNode[] =>
  tree.map((node) =>
    node.id === id ? patch(node) : { ...node, children: updateNode(node.children, id, patch) }
  )

export const removeNode = (tree: MenuNode[], id: string): MenuNode[] =>
  tree
    .filter((node) => node.id !== id)
    .map((node) => ({ ...node, children: removeNode(node.children, id) }))

export const addChild = (tree: MenuNode[], parentId: string | null, child: MenuNode): MenuNode[] =>
  parentId === null
    ? [...tree, child]
    : updateNode(tree, parentId, (node) => ({ ...node, children: [...node.children, child] }))

/**
 * Drops `activeId` at the position of `overId` (same or another parent).
 * Returns the tree unchanged when that would break the depth limit or nest a node inside itself.
 */
export const moveNode = (tree: MenuNode[], activeId: string, overId: string): MenuNode[] => {
  if (activeId === overId) return tree
  const active = findNode(tree, activeId)
  const overParent = parentOf(tree, overId)
  if (!active || overParent === undefined) return tree
  if (overParent !== null && active.children.length > 0) return tree // would become depth 3

  const without = removeNode(tree, activeId)
  const insert = (list: MenuNode[]): MenuNode[] => {
    const index = list.findIndex((node) => node.id === overId)
    if (index < 0) return list.map((node) => ({ ...node, children: insert(node.children) }))
    return [...list.slice(0, index), active, ...list.slice(index)]
  }
  return insert(without)
}

export const nextNodeId = (tree: MenuNode[]): string => {
  let max = 0
  const walk = (list: MenuNode[]) =>
    list.forEach((node) => {
      const n = Number(node.id.replace(/\D/g, ''))
      if (n > max) max = n
      walk(node.children)
    })
  walk(tree)
  return `n${max + 1}`
}
