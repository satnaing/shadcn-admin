import { useCallback, useEffect, useReducer } from 'react'
import {
  KeyboardSensor,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { POINTER_ACTIVATION_DISTANCE_PX } from '../constants'
import type {
  EntityRow,
  ReorderState,
  SortableReorderItem,
} from '../types'
import { buildReorderPayload, findRowIndexById } from '../utils'

type ReorderAction<TData extends EntityRow> =
  | { type: 'sync'; rows: TData[] }
  | { type: 'reorder'; activeId: string | number; overId: string | number }
  | { type: 'rollback'; rows: TData[] }

function reorderReducer<TData extends EntityRow>(
  state: ReorderState<TData>,
  action: ReorderAction<TData>
): ReorderState<TData> {
  switch (action.type) {
    case 'sync':
      return { status: 'idle', rows: action.rows }
    case 'reorder': {
      const oldIndex = findRowIndexById(state.rows, action.activeId)
      const newIndex = findRowIndexById(state.rows, action.overId)

      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
        return state
      }

      return {
        status: 'optimistically-reordered',
        rows: arrayMove(state.rows, oldIndex, newIndex),
      }
    }
    case 'rollback':
      return { status: 'idle', rows: action.rows }
  }
}

interface UseTableRowReorderParams<TData extends EntityRow> {
  data: TData[]
  enabled: boolean
  isPersisting: boolean
  pageIndex: number
  pageSize: number
  onReorder?: (items: SortableReorderItem[]) => void | Promise<void>
}

interface UseTableRowReorderResult<TData extends EntityRow> {
  rows: TData[]
  sensors: ReturnType<typeof useSensors>
  handleDragEnd: (event: DragEndEvent) => Promise<void>
}

export function useTableRowReorder<TData extends EntityRow>({
  data,
  enabled,
  isPersisting,
  pageIndex,
  pageSize,
  onReorder,
}: UseTableRowReorderParams<TData>): UseTableRowReorderResult<TData> {
  const [state, dispatch] = useReducer(reorderReducer<TData>, {
    status: 'idle',
    rows: data,
  })

  useEffect(() => {
    dispatch({ type: 'sync', rows: data })
  }, [data])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: POINTER_ACTIVATION_DISTANCE_PX },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event

      if (
        !enabled ||
        !over ||
        active.id === over.id ||
        isPersisting ||
        !onReorder
      ) {
        return
      }

      const oldIndex = findRowIndexById(state.rows, active.id)
      const newIndex = findRowIndexById(state.rows, over.id)

      if (oldIndex < 0 || newIndex < 0) {
        return
      }

      const reorderedRows = arrayMove(state.rows, oldIndex, newIndex)
      dispatch({
        type: 'reorder',
        activeId: active.id,
        overId: over.id,
      })

      const pageOffset = pageIndex * pageSize
      const payload = buildReorderPayload(reorderedRows, pageOffset)

      try {
        await onReorder(payload)
      } catch {
        // Mutation/toast layer surfaces the failure; roll back optimistic UI.
        dispatch({ type: 'rollback', rows: data })
      }
    },
    [
      data,
      enabled,
      isPersisting,
      onReorder,
      pageIndex,
      pageSize,
      state.rows,
    ]
  )

  return {
    rows: state.rows,
    sensors,
    handleDragEnd,
  }
}
