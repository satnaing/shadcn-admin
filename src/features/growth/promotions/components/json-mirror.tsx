import { useFormContext } from 'react-hook-form'
import { type PromotionViewModel } from '../types'
import { mapFormToDto } from '../utils/promotion-mapper'

export function JsonMirror() {
  const { watch } = useFormContext<PromotionViewModel>()
  const formValues = watch()

  // We try to map it to DTO to show what will be sent
  let output = {}
  try {
    output = mapFormToDto(formValues)
  } catch {
    output = { error: 'Invalid State', raw: formValues }
  }

  return (
    <div className='space-y-4'>
      <div>
        <div className='mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
          DTO Preview
        </div>
        <pre className='overflow-x-auto rounded border border-white/10 bg-black/50 p-2 text-[10px] leading-tight text-green-400'>
          {JSON.stringify(output, null, 2)}
        </pre>
      </div>
      <div>
        <div className='mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
          Form State
        </div>
        <pre className='overflow-x-auto rounded border border-white/10 bg-black/50 p-2 text-[10px] leading-tight text-blue-400'>
          {JSON.stringify(formValues, null, 2)}
        </pre>
      </div>
    </div>
  )
}
