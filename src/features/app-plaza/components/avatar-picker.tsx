import { useRef } from 'react'
import { ImagePlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** 预设渐变头像配色 */
const avatarPresets = [
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
  'from-pink-500 to-rose-500',
  'from-purple-500 to-fuchsia-500',
  'from-cyan-500 to-sky-500',
  'from-red-500 to-orange-500',
  'from-lime-500 to-green-500',
]

type AvatarPickerProps = {
  value: string
  name: string
  onChange: (value: string) => void
}

export function AvatarPicker({ value, name, onChange }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const initial = name.trim().charAt(0).toUpperCase() || 'A'

  return (
    <div className='flex items-center gap-4'>
      <Avatar className='size-14'>
        {value.startsWith('data:') && <AvatarImage src={value} alt={name} />}
        <AvatarFallback
          className={cn('bg-gradient-to-br text-white', avatarPresets[0])}
        >
          {initial}
        </AvatarFallback>
      </Avatar>

      <div className='space-y-2'>
        <div className='flex flex-wrap gap-2'>
          {avatarPresets.map((preset) => (
            <button
              key={preset}
              type='button'
              aria-label={`选择头像颜色 ${preset}`}
              onClick={() => onChange(preset)}
              className={cn(
                'size-6 rounded-full bg-gradient-to-br transition-transform hover:scale-110',
                preset,
                value === preset && 'ring-2 ring-ring ring-offset-2'
              )}
            />
          ))}
        </div>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className='size-4' />
            上传图片
          </Button>
          {value.startsWith('data:') && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => onChange('')}
            >
              移除
            </Button>
          )}
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => onChange(String(reader.result))
              reader.readAsDataURL(file)
              e.target.value = ''
            }}
          />
        </div>
      </div>
    </div>
  )
}
