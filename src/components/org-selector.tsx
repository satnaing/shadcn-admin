import { useMemo, useState, useCallback, useEffect } from 'react'
import { CopyIcon } from 'lucide-react'
import { sortBy } from 'lodash'
import { Loadable } from '@/components/loadable'
import { useOrgsQuery } from '@/graphql/operations/operations.generated'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useRouter } from '@tanstack/react-router'

export function OrgSelector() {
  const { data, loading } = useOrgsQuery()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  
  // Get current org from localStorage
  const [currentOrg, setCurrentOrg] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedOrgId')
    }
    return null
  })

  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1)
    }
  }, [isOpen])

  const selectedOrg = useMemo(() => data?.org.find((o) => o.id === currentOrg), [data, currentOrg])

  const orgsSorted = useMemo(() => {
    const sorted = sortBy(data?.org, 'domain') || []
    if (!searchQuery) return sorted
    return sorted.filter((org) => org.domain.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [data, searchQuery])

  const handleSelect = useCallback(async (orgId: string) => {
    setCurrentOrg(orgId)
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedOrgId', orgId)
    }
    setIsOpen(false)
    setSearchQuery('')
    // Navigate to root and reload to refresh data with new org context
    await router.navigate({ to: '/' })
    window.location.reload()
  }, [router])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isOpen || orgsSorted.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) => Math.min(prev + 1, orgsSorted.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (focusedIndex >= 0) {
            handleSelect(orgsSorted[focusedIndex].id)
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setSearchQuery('')
          break
      }
    },
    [isOpen, orgsSorted, focusedIndex, handleSelect]
  )

  return (
    <Loadable isLoading={loading}>
      <div className="relative" onKeyDown={handleKeyDown}>
        <div className="flex gap-2">
          <Input
            size={16}
            className={cn(
              'w-48',
              currentOrg && 'bg-primary text-primary-foreground placeholder:text-primary-foreground/70'
            )}
            value={isOpen ? searchQuery : selectedOrg?.domain || ''}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsOpen(false)
                setSearchQuery('')
              }, 200)
            }}
            placeholder="Select organization"
          />
          {selectedOrg && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                navigator.clipboard.writeText(selectedOrg?.id || '')
                toast.success('Org ID copied to clipboard')
              }}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isOpen && orgsSorted.length > 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-1 z-50">
            <div className="bg-popover text-popover-foreground rounded-md border shadow-md max-h-[200px] overflow-y-auto">
              {orgsSorted.map((org, index) => (
                <div
                  key={org.id}
                  className={cn(
                    'px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground',
                    focusedIndex === index && 'bg-accent text-accent-foreground'
                  )}
                  onClick={() => handleSelect(org.id)}
                  role="option"
                  aria-selected={focusedIndex === index}
                >
                  {org.domain}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Loadable>
  )
}


