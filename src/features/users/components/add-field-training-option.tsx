import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AddFieldTrainingModal } from './add-field-training-modal'

type AddFieldTrainingOptionProps = {
  type: 'company' | 'job'
  onClick?: () => void
  onSuccess?: () => void
}

export const AddFieldTrainingOption = ({
  type,
  onClick,
  onSuccess,
}: AddFieldTrainingOptionProps) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setModalOpen(true)

    if (onClick) {
      onClick()
    }
  }

  return (
    <>
      <div className='mt-1 border-t px-2 py-2'>
        <Button
          variant='ghost'
          size='sm'
          className='flex w-full items-center justify-start text-sm'
          onClick={handleClick}
        >
          <span className='mr-1'>+</span>
          {type === 'company' ? '새 회사 추가하기' : '새 직무 추가하기'}
        </Button>
      </div>

      <AddFieldTrainingModal
        type={type}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={onSuccess}
      />
    </>
  )
}
