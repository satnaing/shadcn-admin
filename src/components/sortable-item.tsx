import type { ComponentProps, ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Handle = Pick<ReturnType<typeof useSortable>, 'attributes' | 'listeners'>

interface SortableItemProps extends Omit<ComponentProps<'li'>, 'children' | 'id'> {
  id: string
  children: (handle: Handle) => ReactNode
}

/** `<li>` that follows a dnd-kit sort; the transform needs a style attribute, so it lives outside `features/`. */
export function SortableItem({ id, children, ...rest }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...rest}
    >
      {children({ attributes, listeners })}
    </li>
  )
}
