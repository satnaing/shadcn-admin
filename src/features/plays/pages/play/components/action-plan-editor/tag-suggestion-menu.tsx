import { useEffect, useImperativeHandle, useState, useMemo, useCallback } from 'react'
import { useSlackChannelsQuery, useCrmListsQuery } from '@/graphql/operations/operations.generated'
import { debounce, groupBy } from 'lodash'
import { Hash, User, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserAccountMappingsQuery } from '../../../../graphql/operations.generated'
import { type TagAttributes } from './tag-node'

interface TagSuggestionMenuProps {
  items: TagAttributes[]
  command: (props: TagAttributes) => void
  editor: any
  query: string
  triggerChar: string
  tagType: TagAttributes['type']
}

export const TagSuggestionMenu = ({
  ref,
  command,
  query,
  tagType,
}: TagSuggestionMenuProps & { ref?: React.RefObject<any | null> }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const { data: slackChannelsData, loading: slackChannelsLoading } = useSlackChannelsQuery({
    skip: tagType !== 'channel',
  })
  const { data: crmListsData, loading: crmListsLoading } = useCrmListsQuery({
    variables: { q: debouncedQuery || undefined },
    skip: tagType !== 'channel',
  })
  const { data: userAccountMappingsData, loading: userAccountMappingsLoading } =
    useUserAccountMappingsQuery({
      variables: {
        filters: { search: debouncedQuery || undefined },
        page: { limit: 10, offset: 0 },
      },
      skip: tagType !== 'user',
    })

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setDebouncedQuery(value), 300),
    []
  )

  useEffect(() => {
    if (tagType === 'channel' || tagType === 'user') {
      debouncedSetQuery(query)
    }
  }, [query, tagType, debouncedSetQuery])

  // Filter and map items based on type with grouping
  const filteredItems = useMemo(() => {
    if (tagType === 'channel') {
      const results = []
      const lowerQuery = query.toLowerCase()

      // Add Slack channels
      if (slackChannelsData?.slackChannels) {
        const slackChannels = slackChannelsData.slackChannels
          .filter(
            (channel) =>
              channel.name.toLowerCase().includes(lowerQuery) ||
              channel.id.toLowerCase().includes(lowerQuery)
          )
          .map((channel) => ({
            id: channel.id,
            type: 'channel' as const,
            subtype: 'slack-channel' as const,
            label: `#${channel.name}`,
            value: channel.id,
            group: 'Slack',
          }))
          .slice(0, 5) // Limit to 5 Slack results

        results.push(...slackChannels)
      }

      // Add HubSpot lists
      if (crmListsData?.crmLists?.data) {
        const hubspotLists = crmListsData.crmLists.data
          .map((list) => ({
            id: list.listId,
            type: 'channel' as const,
            subtype: 'hubspot-list' as const,
            label: list.name,
            value: list.listId,
            group: 'HubSpot',
          }))
          .slice(0, 5) // Limit to 5 HubSpot results

        results.push(...hubspotLists)
      }

      return results
    }

    if (tagType === 'user' && userAccountMappingsData?.userAccountMappings?.data) {
      // Server-side search for users with grouping by app
      const filtered = userAccountMappingsData.userAccountMappings.data
        .map((user) => {
          const accountDetails = user.accountDetails as any
          const displayName =
            accountDetails.displayName ||
            (accountDetails.firstName
              ? `${accountDetails.firstName || ''} ${accountDetails.lastName || ''}`.trim()
              : undefined)

          // Map accountType to readable group names
          const groupName =
            user.accountType === 'SLACK'
              ? 'Slack'
              : user.accountType === 'HUBSPOT'
                ? 'HubSpot'
                : 'Other'

          return {
            id: user.id,
            type: 'user' as const,
            label: displayName ? `${displayName} (${user.email})` : user.email,
            value: user.id,
            group: groupName,
            accountType: user.accountType,
          }
        })
        .slice(0, 10) // Limit to 10 results

      return filtered.sort((a, b) => {
        if (a.group === 'Slack') return -1
        if (b.group === 'Slack') return 1
        if (a.group === 'HubSpot') return -1
        if (b.group === 'HubSpot') return 1
        return a.group.localeCompare(b.group)
      })
    }

    return []
  }, [tagType, query, slackChannelsData, crmListsData, userAccountMappingsData])

  const selectItem = useCallback(
    (index: number) => {
      const item = filteredItems[index]
      if (item) {
        // For channel type, we need to pass subtype information
        if (item.type === 'channel') {
          command({
            id: item.id,
            type: item.type,
            label: item.label,
            value: item.value,
            subtype: item.subtype,
          })
        } else {
          command(item)
        }
      }
    },
    [filteredItems, command]
  )

  const upHandler = () => {
    setSelectedIndex((selectedIndex + filteredItems.length - 1) % filteredItems.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % filteredItems.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => {
    setSelectedIndex(0)
  }, [query, filteredItems.length])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      if (event.key === 'Tab') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  const getIcon = useCallback((item: any) => {
    if (item.type === 'channel') {
      return item.subtype === 'hubspot-list' ? (
        <List className='h-4 w-4' />
      ) : (
        <Hash className='h-4 w-4' />
      )
    }

    switch (item.type) {
      case 'slack-channel':
        return <Hash className='h-4 w-4' />
      case 'user':
        return <User className='h-4 w-4' />
      case 'hubspot-list':
        return <List className='h-4 w-4' />
      default:
        return <Hash className='h-4 w-4' />
    }
  }, [])

  const getTitle = () => {
    switch (tagType) {
      case 'channel':
        return 'Channels & Lists'
      case 'user':
        return 'Users'
      default:
        return 'Results'
    }
  }

  const isLoading =
    (tagType === 'channel' && (slackChannelsLoading || crmListsLoading)) ||
    (tagType === 'user' && userAccountMappingsLoading)

  const showNoResults = !isLoading && filteredItems.length === 0

  // Helper function to render individual items
  const renderItem = useCallback(
    (item: any, itemIndex: number) => (
      <button
        key={`${item.type}-${item.id}`}
        className={cn(
          'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
          'hover:bg-accent hover:text-accent-foreground',
          'cursor-pointer',
          selectedIndex === itemIndex && 'bg-accent text-accent-foreground'
        )}
        onClick={() => selectItem(itemIndex)}
        onMouseEnter={() => setSelectedIndex(itemIndex)}
      >
        {getIcon(item)}
        <span className='flex-1 truncate text-left'>{item.label}</span>
      </button>
    ),
    [selectedIndex, getIcon, selectItem]
  )

  // Helper function to render grouped items
  const renderGroupedItems = useCallback(
    (items: any[]) => {
      const grouped = groupBy(items, (i) => i.group || 'Other')

      let currentIndex = 0
      return Object.entries(grouped).map(([groupName, groupItems]: [string, any]) => (
        <div key={groupName}>
          {/* Group header */}
          <div className='border-b px-2 py-1 text-xs font-medium'>{groupName}</div>
          {/* Group items */}
          {groupItems.map((item: any) => {
            const itemIndex = currentIndex++
            return renderItem(item, itemIndex)
          })}
        </div>
      ))
    },
    [renderItem]
  )

  return (
    <div className='bg-popover text-popover-foreground z-50 max-w-[320px] min-w-[240px] overflow-hidden rounded-md border p-1 shadow-md'>
      <div className='text-muted-foreground px-2 py-1.5 text-xs font-semibold'>
        {getTitle()}
        {query && <span className='ml-2 font-normal'>matching "{query}"</span>}
      </div>

      {isLoading && (
        <div className='space-y-1 p-2'>
          <>
            <Skeleton key='skeleton-1' className='h-8 w-full' />
            <Skeleton key='skeleton-2' className='h-8 w-full' />
            <Skeleton key='skeleton-3' className='h-8 w-full' />
          </>
        </div>
      )}

      {showNoResults && (
        <div className='text-muted-foreground px-2 py-6 text-center text-sm'>
          No results found{query ? ` for "${query}"` : ''}
        </div>
      )}

      {!isLoading && filteredItems.length > 0 && (
        <>
          <div className='max-h-[300px] overflow-y-auto'>{renderGroupedItems(filteredItems)}</div>
          <div className='mt-1 border-t pt-1'>
            <div className='text-muted-foreground px-2 py-1 text-xs'>
              Press <kbd className='bg-muted ml-1 rounded px-1 py-0.5 text-xs'>Enter</kbd> or{' '}
              <kbd className='bg-muted rounded px-1 py-0.5 text-xs'>Tab</kbd> to select
            </div>
          </div>
        </>
      )}
    </div>
  )
}

TagSuggestionMenu.displayName = 'TagSuggestionMenu'
