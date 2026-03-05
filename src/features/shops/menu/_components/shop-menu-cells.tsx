import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBadges } from '@/services/badges'
import { Loader2, CheckIcon, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge as UI_Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { type Badge as MarketingBadge } from '@/features/menu/data/badge-schema'

const PriceCell = ({
  price: initialPrice,
  placeholder,
  onUpdate,
}: {
  price: string | number
  placeholder?: string
  onUpdate: (price: number) => void
}) => {
  const [price, setPrice] = useState(initialPrice || '')

  useEffect(() => {
    setPrice(initialPrice)
  }, [initialPrice])

  const handleBlur = () => {
    if (price !== initialPrice) {
      onUpdate(Number(price))
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <Input
        type='number'
        className='h-8 w-24'
        placeholder={placeholder || '0'}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  )
}

const AvailabilityCell = ({
  isAvailable,
  isPending,
  onUpdate,
}: {
  isAvailable: boolean
  isPending?: boolean
  onUpdate: (checked: boolean) => void
}) => {
  return (
    <Switch
      checked={isAvailable}
      disabled={isPending}
      onCheckedChange={onUpdate}
    />
  )
}

const BadgeCell = ({
  selectedBadgeIds,
  selectedBadges: initialBadges,
  isPending,
  onUpdate,
}: {
  selectedBadgeIds: string[]
  selectedBadges?: MarketingBadge[]
  isPending?: boolean
  onUpdate: (badgeIds: string[]) => void
}) => {
  const [open, setOpen] = useState(false)
  const { data: badges } = useQuery({
    queryKey: ['badges'],
    queryFn: getBadges,
  })

  const currentBadgeIds = selectedBadgeIds || []

  const displayBadges =
    initialBadges ||
    badges?.data?.filter((b: MarketingBadge) =>
      currentBadgeIds.includes(b.id!)
    ) ||
    []

  const toggleBadge = (badgeId: string) => {
    if (isPending) return
    const newBadgeIds = currentBadgeIds.includes(badgeId)
      ? currentBadgeIds.filter((id) => id !== badgeId)
      : [...currentBadgeIds, badgeId]

    onUpdate(newBadgeIds)
    setOpen(false) // Close popover after selection
  }

  return (
    <div className='flex flex-wrap gap-1'>
      {displayBadges.map((badge: MarketingBadge) => (
        <UI_Badge
          key={badge.id}
          variant='outline'
          className='flex items-center gap-1 px-2 py-0 text-[10px]'
          style={{
            borderColor: badge.bgColor,
            color: badge.textColor,
            backgroundColor: badge.bgColor,
          }}
        >
          {badge.label.en}
          {isPending ? (
            <Loader2 className='h-2 w-2 animate-spin' />
          ) : (
            <button
              type='button'
              className='ml-1 rounded-full outline-none hover:bg-black/10'
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                toggleBadge(badge.id!)
              }}
            >
              <X className='h-2.5 w-2.5' />
            </button>
          )}
        </UI_Badge>
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='h-6 w-6 rounded-full'
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className='h-3 w-3 animate-spin' />
            ) : (
              <Plus className='h-3 w-3' />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-48 p-0' align='start'>
          <Command>
            <CommandInput placeholder='Search badge...' className='h-8' />
            <CommandList>
              <CommandEmpty>No badge found.</CommandEmpty>
              <CommandGroup>
                {badges?.data?.map((badge: MarketingBadge) => (
                  <CommandItem
                    key={badge.id}
                    onSelect={() => toggleBadge(badge.id!)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        currentBadgeIds.includes(badge.id!)
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-3 w-3')} />
                    </div>
                    <span
                      className='truncate text-xs'
                      style={{ color: badge.textColor }}
                    >
                      {badge.label.en}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { PriceCell, AvailabilityCell, BadgeCell }
