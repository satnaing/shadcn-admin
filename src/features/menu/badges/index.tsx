import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getBadges,
  createBadge,
  updateBadge,
  deleteBadge,
} from '@/services/badges'
import { toast } from 'sonner'
import { BrandLoader } from '@/components/ui/brand-loader'
import { PageTitle } from '@/components/page-title'
import { type Badge } from '../data/badge-schema'
import { BadgeSheet } from './_components/badge-sheet'
import { BadgeTable } from './_components/badge-table'

export function BadgesPage() {
  const queryClient = useQueryClient()
  const { data: response, isLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: getBadges,
  })
  const badges = response?.data || []

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const createMutation = useMutation({
    mutationFn: createBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] })
      setIsSheetOpen(false)
      toast.success('Badge created successfully')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err?.response?.data?.message || 'Failed to create badge')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Badge> }) =>
      updateBadge(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] })
      setIsSheetOpen(false)
      toast.success('Badge updated successfully')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err?.response?.data?.message || 'Failed to update badge')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] })
      toast.success('Badge deleted successfully')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err?.response?.data?.message || 'Failed to delete badge')
    },
  })

  const handleEdit = (badge: Badge) => {
    setSelectedBadge(badge)
    setIsSheetOpen(true)
  }

  const handleCreate = () => {
    setSelectedBadge(null)
    setIsSheetOpen(true)
  }

  const handleSave = (badgeData: Omit<Badge, 'id'>) => {
    if (selectedBadge?.id) {
      updateMutation.mutate({ id: selectedBadge.id as string, data: badgeData })
    } else {
      createMutation.mutate(badgeData)
    }
  }

  const handleDelete = (badgeToDelete: Badge) => {
    if (
      badgeToDelete.id &&
      confirm('Are you sure you want to delete this badge?')
    ) {
      deleteMutation.mutate(badgeToDelete.id as string)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  if (isLoading) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col space-y-6 p-6'>
      <PageTitle
        title='Marketing Badges'
        subtitle='Manage badges for product labeling (e.g., Best Seller, New, Spicy).'
        buttonLabel='Create Badge'
        onClick={handleCreate}
      />

      <BadgeTable data={badges} onEdit={handleEdit} onDelete={handleDelete} />

      <BadgeSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        badge={selectedBadge}
        onSave={handleSave}
        isPending={isPending}
      />
    </div>
  )
}
