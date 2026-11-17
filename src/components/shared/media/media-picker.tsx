import { useState } from 'react'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { FileText, GripVertical, ImagePlus, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { SortableItem } from '@/components/sortable-item'
import { MediaLibraryDialog } from './media-library-dialog'
import { moveItem } from './media.logic'
import type { MediaAccept, MediaRef } from './media.type'

export interface MediaPickerProps {
  value: MediaRef[]
  onChange: (files: MediaRef[]) => void
  multiple?: boolean
  accept?: MediaAccept
  max?: number
  disabled?: boolean
}

/** Chosen files as thumbnails (drag to reorder in multi mode) + "Choose from library" dialog. */
export function MediaPicker({ value, onChange, multiple = false, accept = 'image', max, disabled }: MediaPickerProps) {
  const { t } = useTranslation('media')
  const [open, setOpen] = useState(false)
  const ids = value.map((f) => `${f.id}:${f.url}`)

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      onChange(moveItem(value, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))))
    }
  }

  return (
    <div className='space-y-2'>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          <ul className='flex flex-wrap gap-2'>
            {value.map((f, i) => (
              <SortableItem key={ids[i]} id={ids[i]} className='relative size-20 list-none overflow-hidden rounded-md border bg-muted'>
                {({ attributes, listeners }) => (
                  <>
                    {f.type === 'image' ? (
                      <img src={f.url} alt={f.name} className='size-full object-cover' />
                    ) : (
                      <span className='flex size-full flex-col items-center justify-center gap-1 p-1 text-[10px]'>
                        <FileText className='size-6' />
                        <span className='w-full truncate text-center'>{f.name}</span>
                      </span>
                    )}
                    {!disabled && (
                      <>
                        <button
                          type='button'
                          aria-label={t('picker.remove', { name: f.name })}
                          className='absolute end-0.5 top-0.5 rounded bg-background/80 p-0.5'
                          onClick={() => onChange(value.filter((_, j) => j !== i))}
                        >
                          <X className='size-3' />
                        </button>
                        {multiple && value.length > 1 && (
                          <button
                            type='button'
                            aria-label={t('picker.drag')}
                            className='absolute bottom-0.5 start-0.5 cursor-grab rounded bg-background/80 p-0.5'
                            {...attributes}
                            {...listeners}
                          >
                            <GripVertical className='size-3' />
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {!disabled && (!max || value.length < max) && (multiple || value.length === 0) && (
        <Button type='button' variant='outline' size='sm' onClick={() => setOpen(true)}>
          <ImagePlus className='me-2 size-4' />
          {t(multiple ? 'picker.chooseMany' : 'picker.choose')}
        </Button>
      )}
      {open && (
        <MediaLibraryDialog
          open
          onOpenChange={setOpen}
          accept={accept}
          multiple={multiple}
          max={max}
          initial={value}
          onConfirm={onChange}
        />
      )}
    </div>
  )
}
