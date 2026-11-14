interface CrudTabSearch {
  filter?: string
}

export type CrudListTab = 'list' | 'trash' | 'page-content' | 'ui-messages'

export function resolveListTrashTab(
  filter?: string,
  options?: { includePageContent?: boolean; includeUiMessages?: boolean }
): CrudListTab {
  if (filter === 'trash') {
    return 'trash'
  }

  if (options?.includePageContent && filter === 'page-content') {
    return 'page-content'
  }

  if (options?.includeUiMessages && filter === 'ui-messages') {
    return 'ui-messages'
  }

  return 'list'
}

export function createCrudTabChangeHandler(
  navigate: (options: {
    search: (previous: CrudTabSearch) => CrudTabSearch
  }) => void,
  options?: { includePageContent?: boolean; includeUiMessages?: boolean }
) {
  return (value: string) => {
    if (value === 'trash') {
      navigate({
        search: (previous) => ({ ...previous, filter: 'trash' }),
      })
      return
    }

    if (options?.includePageContent && value === 'page-content') {
      navigate({
        search: (previous) => ({ ...previous, filter: 'page-content' }),
      })
      return
    }

    if (options?.includeUiMessages && value === 'ui-messages') {
      navigate({
        search: (previous) => ({ ...previous, filter: 'ui-messages' }),
      })
      return
    }

    navigate({
      search: (previous) => {
        const { filter, ...rest } = previous
        return rest
      },
    })
  }
}
