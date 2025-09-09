import { gql } from '@apollo/client'
import type * as ApolloReactCommon from '@apollo/client'
import * as ApolloReactHooks from '@apollo/client'
import type * as Types from '../../../graphql/global/types.generated'

const defaultOptions = {} as const
export type ExecutionsQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.PaginationInput>
  filters?: Types.InputMaybe<Types.ExecutionFilter>
}>

export type ExecutionsQuery = {
  __typename?: 'Query'
  executions: {
    __typename?: 'PaginatedExecutions'
    hasMore: boolean
    totalCount?: number | null
    hasData?: boolean | null
    data: Array<{
      __typename?: 'Execution'
      id: string
      createdAt: any
      completedAt?: any | null
      result?: any | null
      summary?: string | null
      status: Types.ExecutionStatus
      scenarioId?: string | null
      playbookId?: string | null
      entityId?: string | null
      entityType?: Types.ExecutionEntityType | null
      type: Types.ExecutionType
      errorMessage?: string | null
      initiatedBy?: string | null
      initiatedFrom: Types.ExecutionInitiatedFrom
      identity?: {
        __typename?: 'ExecutionIdentity'
        name: string
        id: string
        type: string
        url: string
      } | null
    }>
  }
}

export type ScenariosForFilterQueryVariables = Types.Exact<{ [key: string]: never }>

export type ScenariosForFilterQuery = {
  __typename?: 'Query'
  playbookScenarios: Array<{
    __typename?: 'PlaybookScenario'
    id: string
    name: string
    playbookId: string
  }>
}

export type PlaybooksForFilterQueryVariables = Types.Exact<{ [key: string]: never }>

export type PlaybooksForFilterQuery = {
  __typename?: 'Query'
  playbooks: Array<{ __typename?: 'Playbook'; id: string; name: string; isEnabled: boolean }>
}

export const ExecutionsDocument = gql`
  query Executions($page: PaginationInput, $filters: ExecutionFilter) {
    executions(page: $page, filters: $filters) {
      data {
        id
        createdAt
        completedAt
        result
        summary
        status
        identity {
          name
          id
          type
          url
        }
        scenarioId
        playbookId
        entityId
        entityType
        type
        errorMessage
        initiatedBy
        initiatedFrom
      }
      hasMore
      totalCount
      hasData
    }
  }
`

/**
 * __useExecutionsQuery__
 *
 * To run a query within a React component, call `useExecutionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useExecutionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExecutionsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useExecutionsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<ExecutionsQuery, ExecutionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ExecutionsQuery, ExecutionsQueryVariables>(
    ExecutionsDocument,
    options
  )
}
export function useExecutionsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ExecutionsQuery, ExecutionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<ExecutionsQuery, ExecutionsQueryVariables>(
    ExecutionsDocument,
    options
  )
}
export function useExecutionsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<ExecutionsQuery, ExecutionsQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<ExecutionsQuery, ExecutionsQueryVariables>(
    ExecutionsDocument,
    options
  )
}
export type ExecutionsQueryHookResult = ReturnType<typeof useExecutionsQuery>
export type ExecutionsLazyQueryHookResult = ReturnType<typeof useExecutionsLazyQuery>
export type ExecutionsSuspenseQueryHookResult = ReturnType<typeof useExecutionsSuspenseQuery>
export type ExecutionsQueryResult = ApolloReactCommon.QueryResult<
  ExecutionsQuery,
  ExecutionsQueryVariables
>
export const ScenariosForFilterDocument = gql`
  query ScenariosForFilter {
    playbookScenarios {
      id
      name
      playbookId
    }
  }
`

/**
 * __useScenariosForFilterQuery__
 *
 * To run a query within a React component, call `useScenariosForFilterQuery` and pass it any options that fit your needs.
 * When your component renders, `useScenariosForFilterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScenariosForFilterQuery({
 *   variables: {
 *   },
 * });
 */
export function useScenariosForFilterQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ScenariosForFilterQuery,
    ScenariosForFilterQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ScenariosForFilterQuery, ScenariosForFilterQueryVariables>(
    ScenariosForFilterDocument,
    options
  )
}
export function useScenariosForFilterLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ScenariosForFilterQuery,
    ScenariosForFilterQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<ScenariosForFilterQuery, ScenariosForFilterQueryVariables>(
    ScenariosForFilterDocument,
    options
  )
}
export function useScenariosForFilterSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        ScenariosForFilterQuery,
        ScenariosForFilterQueryVariables
      >
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<
    ScenariosForFilterQuery,
    ScenariosForFilterQueryVariables
  >(ScenariosForFilterDocument, options)
}
export type ScenariosForFilterQueryHookResult = ReturnType<typeof useScenariosForFilterQuery>
export type ScenariosForFilterLazyQueryHookResult = ReturnType<
  typeof useScenariosForFilterLazyQuery
>
export type ScenariosForFilterSuspenseQueryHookResult = ReturnType<
  typeof useScenariosForFilterSuspenseQuery
>
export type ScenariosForFilterQueryResult = ApolloReactCommon.QueryResult<
  ScenariosForFilterQuery,
  ScenariosForFilterQueryVariables
>
export const PlaybooksForFilterDocument = gql`
  query PlaybooksForFilter {
    playbooks {
      id
      name
      isEnabled
    }
  }
`

/**
 * __usePlaybooksForFilterQuery__
 *
 * To run a query within a React component, call `usePlaybooksForFilterQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaybooksForFilterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaybooksForFilterQuery({
 *   variables: {
 *   },
 * });
 */
export function usePlaybooksForFilterQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    PlaybooksForFilterQuery,
    PlaybooksForFilterQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<PlaybooksForFilterQuery, PlaybooksForFilterQueryVariables>(
    PlaybooksForFilterDocument,
    options
  )
}
export function usePlaybooksForFilterLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    PlaybooksForFilterQuery,
    PlaybooksForFilterQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<PlaybooksForFilterQuery, PlaybooksForFilterQueryVariables>(
    PlaybooksForFilterDocument,
    options
  )
}
export function usePlaybooksForFilterSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        PlaybooksForFilterQuery,
        PlaybooksForFilterQueryVariables
      >
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<
    PlaybooksForFilterQuery,
    PlaybooksForFilterQueryVariables
  >(PlaybooksForFilterDocument, options)
}
export type PlaybooksForFilterQueryHookResult = ReturnType<typeof usePlaybooksForFilterQuery>
export type PlaybooksForFilterLazyQueryHookResult = ReturnType<
  typeof usePlaybooksForFilterLazyQuery
>
export type PlaybooksForFilterSuspenseQueryHookResult = ReturnType<
  typeof usePlaybooksForFilterSuspenseQuery
>
export type PlaybooksForFilterQueryResult = ApolloReactCommon.QueryResult<
  PlaybooksForFilterQuery,
  PlaybooksForFilterQueryVariables
>
