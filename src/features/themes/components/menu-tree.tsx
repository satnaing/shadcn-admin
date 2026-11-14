import { Fragment } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { moveNode } from '../data/menu-tree'
import type { MenuNode } from '../data/themes.type'
import { MenuNodeRow, type MenuHandlers } from './menu-node-row'

interface MenuBranchProps {
  nodes: MenuNode[]
  depth: number
  handlers: MenuHandlers
}

function MenuBranch({ nodes, depth, handlers }: MenuBranchProps) {
  return (
    <SortableContext items={nodes.map((node) => node.id)} strategy={verticalListSortingStrategy}>
      <ul className='space-y-2'>
        {nodes.map((node) => (
          <Fragment key={node.id}>
            <MenuNodeRow node={node} depth={depth} handlers={handlers} />
            {node.children.length > 0 && (
              <li className='ml-8 list-none'>
                <MenuBranch nodes={node.children} depth={depth + 1} handlers={handlers} />
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </SortableContext>
  )
}

interface MenuTreeProps {
  items: MenuNode[]
  onChange: (items: MenuNode[]) => void
  handlers: MenuHandlers
}

/** Drag & drop tree (2 levels). Dropping on a row inserts before it, in that row's parent. */
export function MenuTree({ items, onChange, handlers }: MenuTreeProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over) onChange(moveNode(items, String(active.id), String(over.id)))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <MenuBranch nodes={items} depth={1} handlers={handlers} />
    </DndContext>
  )
}
