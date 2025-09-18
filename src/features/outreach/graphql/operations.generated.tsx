import { gql } from '@apollo/client'
import type * as ApolloReactCommon from '@apollo/client'
import * as ApolloReactHooks from '@apollo/client'
import type * as Types from '../../../graphql/global/types.generated'

const defaultOptions = {} as const
export type GetCampaignContactsQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.PaginationInput>
  filters?: Types.InputMaybe<Types.CampaignContactFilter>
}>

export type GetCampaignContactsQuery = {
  __typename?: 'Query'
  campaignContacts: {
    __typename?: 'PaginatedCampaignContacts'
    totalCount?: number | null
    hasMore: boolean
    data: Array<{
      __typename?: 'CampaignContact'
      id: string
      status: Types.CampaignContactStatus
      statusReason?: Types.CampaignContactStatusReason | null
      createdAt: any
      updatedAt: any
      connectedAt?: any | null
      connectionSentAt?: any | null
      contactedAt?: any | null
      repliedAt?: any | null
      finishedAt?: any | null
      rejectedAt?: any | null
      reachoutReason?: string | null
      error?: string | null
      sender?: {
        __typename?: 'ConnectedAccount'
        id: string
        name: string
        email?: string | null
        isLinkedinEnabled: boolean
        isEmailEnabled: boolean
      } | null
      contact: {
        __typename?: 'Contact'
        id: string
        firstName?: string | null
        executionId?: string | null
        lastName?: string | null
        workEmail?: string | null
        profilePicUrl?: string | null
        linkedinUrl?: string | null
        title?: string | null
        country?: string | null
        company?: { __typename?: 'Company'; name?: string | null; domain: string } | null
      }
    }>
  }
}

export type GetConnectedAccountsForOutreachQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetConnectedAccountsForOutreachQuery = {
  __typename?: 'Query'
  connectedAccounts: Array<{
    __typename?: 'ConnectedAccount'
    id: string
    name: string
    email?: string | null
    isLinkedinEnabled: boolean
    isEmailEnabled: boolean
  }>
}

export type GetMessagesByCampaignContactQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.MessageFilter>
}>

export type GetMessagesByCampaignContactQuery = {
  __typename?: 'Query'
  messages: {
    __typename?: 'PaginatedMessages'
    totalCount?: number | null
    hasMore: boolean
    data: Array<{
      __typename?: 'Message'
      id: string
      text: string
      subject?: string | null
      type: Types.MessageType
      appType: Types.MessageAppType
      source?: Types.MessageSource | null
      isRead: boolean
      reaction?: string | null
      createdAt: any
      updatedAt: any
      campaignContactId: string
      campaignStepId?: string | null
      contactId: string
    }>
  }
}

export type CampaignContactPauseMutationVariables = Types.Exact<{
  input: Types.CampaignContactPauseInput
}>

export type CampaignContactPauseMutation = {
  __typename?: 'Mutation'
  campaignContactPause: Array<{
    __typename?: 'CampaignContact'
    id: string
    status: Types.CampaignContactStatus
    statusReason?: Types.CampaignContactStatusReason | null
    updatedAt: any
  }>
}

export type CampaignContactContinueMutationVariables = Types.Exact<{
  input: Types.CampaignContactContinueInput
}>

export type CampaignContactContinueMutation = {
  __typename?: 'Mutation'
  campaignContactContinue: Array<{
    __typename?: 'CampaignContact'
    id: string
    status: Types.CampaignContactStatus
    statusReason?: Types.CampaignContactStatusReason | null
    updatedAt: any
  }>
}

export const GetCampaignContactsDocument = gql`
  query GetCampaignContacts($page: PaginationInput, $filters: CampaignContactFilter) {
    campaignContacts(page: $page, filters: $filters) {
      data {
        id
        status
        statusReason
        createdAt
        updatedAt
        connectedAt
        connectionSentAt
        contactedAt
        repliedAt
        finishedAt
        rejectedAt
        reachoutReason
        error
        sender {
          id
          name
          email
          isLinkedinEnabled
          isEmailEnabled
        }
        contact {
          id
          firstName
          executionId
          lastName
          workEmail
          profilePicUrl
          linkedinUrl
          company {
            name
            domain
          }
          title
          country
        }
      }
      totalCount
      hasMore
    }
  }
`

/**
 * __useGetCampaignContactsQuery__
 *
 * To run a query within a React component, call `useGetCampaignContactsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCampaignContactsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCampaignContactsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetCampaignContactsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCampaignContactsQuery,
    GetCampaignContactsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<GetCampaignContactsQuery, GetCampaignContactsQueryVariables>(
    GetCampaignContactsDocument,
    options
  )
}
export function useGetCampaignContactsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCampaignContactsQuery,
    GetCampaignContactsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<GetCampaignContactsQuery, GetCampaignContactsQueryVariables>(
    GetCampaignContactsDocument,
    options
  )
}
export function useGetCampaignContactsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        GetCampaignContactsQuery,
        GetCampaignContactsQueryVariables
      >
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<
    GetCampaignContactsQuery,
    GetCampaignContactsQueryVariables
  >(GetCampaignContactsDocument, options)
}
export type GetCampaignContactsQueryHookResult = ReturnType<typeof useGetCampaignContactsQuery>
export type GetCampaignContactsLazyQueryHookResult = ReturnType<
  typeof useGetCampaignContactsLazyQuery
>
export type GetCampaignContactsSuspenseQueryHookResult = ReturnType<
  typeof useGetCampaignContactsSuspenseQuery
>
export type GetCampaignContactsQueryResult = ApolloReactCommon.QueryResult<
  GetCampaignContactsQuery,
  GetCampaignContactsQueryVariables
>
export const GetConnectedAccountsForOutreachDocument = gql`
  query GetConnectedAccountsForOutreach {
    connectedAccounts {
      id
      name
      email
      isLinkedinEnabled
      isEmailEnabled
    }
  }
`

/**
 * __useGetConnectedAccountsForOutreachQuery__
 *
 * To run a query within a React component, call `useGetConnectedAccountsForOutreachQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConnectedAccountsForOutreachQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConnectedAccountsForOutreachQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetConnectedAccountsForOutreachQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetConnectedAccountsForOutreachQuery,
    GetConnectedAccountsForOutreachQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetConnectedAccountsForOutreachQuery,
    GetConnectedAccountsForOutreachQueryVariables
  >(GetConnectedAccountsForOutreachDocument, options)
}
export function useGetConnectedAccountsForOutreachLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetConnectedAccountsForOutreachQuery,
    GetConnectedAccountsForOutreachQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetConnectedAccountsForOutreachQuery,
    GetConnectedAccountsForOutreachQueryVariables
  >(GetConnectedAccountsForOutreachDocument, options)
}
export function useGetConnectedAccountsForOutreachSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        GetConnectedAccountsForOutreachQuery,
        GetConnectedAccountsForOutreachQueryVariables
      >
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<
    GetConnectedAccountsForOutreachQuery,
    GetConnectedAccountsForOutreachQueryVariables
  >(GetConnectedAccountsForOutreachDocument, options)
}
export type GetConnectedAccountsForOutreachQueryHookResult = ReturnType<
  typeof useGetConnectedAccountsForOutreachQuery
>
export type GetConnectedAccountsForOutreachLazyQueryHookResult = ReturnType<
  typeof useGetConnectedAccountsForOutreachLazyQuery
>
export type GetConnectedAccountsForOutreachSuspenseQueryHookResult = ReturnType<
  typeof useGetConnectedAccountsForOutreachSuspenseQuery
>
export type GetConnectedAccountsForOutreachQueryResult = ApolloReactCommon.QueryResult<
  GetConnectedAccountsForOutreachQuery,
  GetConnectedAccountsForOutreachQueryVariables
>
export const GetMessagesByCampaignContactDocument = gql`
  query GetMessagesByCampaignContact($filters: MessageFilter) {
    messages(filters: $filters) {
      data {
        id
        text
        subject
        type
        appType
        source
        isRead
        reaction
        createdAt
        updatedAt
        campaignContactId
        campaignStepId
        contactId
      }
      totalCount
      hasMore
    }
  }
`

/**
 * __useGetMessagesByCampaignContactQuery__
 *
 * To run a query within a React component, call `useGetMessagesByCampaignContactQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesByCampaignContactQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesByCampaignContactQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetMessagesByCampaignContactQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetMessagesByCampaignContactQuery,
    GetMessagesByCampaignContactQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetMessagesByCampaignContactQuery,
    GetMessagesByCampaignContactQueryVariables
  >(GetMessagesByCampaignContactDocument, options)
}
export function useGetMessagesByCampaignContactLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetMessagesByCampaignContactQuery,
    GetMessagesByCampaignContactQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetMessagesByCampaignContactQuery,
    GetMessagesByCampaignContactQueryVariables
  >(GetMessagesByCampaignContactDocument, options)
}
export function useGetMessagesByCampaignContactSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        GetMessagesByCampaignContactQuery,
        GetMessagesByCampaignContactQueryVariables
      >
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<
    GetMessagesByCampaignContactQuery,
    GetMessagesByCampaignContactQueryVariables
  >(GetMessagesByCampaignContactDocument, options)
}
export type GetMessagesByCampaignContactQueryHookResult = ReturnType<
  typeof useGetMessagesByCampaignContactQuery
>
export type GetMessagesByCampaignContactLazyQueryHookResult = ReturnType<
  typeof useGetMessagesByCampaignContactLazyQuery
>
export type GetMessagesByCampaignContactSuspenseQueryHookResult = ReturnType<
  typeof useGetMessagesByCampaignContactSuspenseQuery
>
export type GetMessagesByCampaignContactQueryResult = ApolloReactCommon.QueryResult<
  GetMessagesByCampaignContactQuery,
  GetMessagesByCampaignContactQueryVariables
>
export const CampaignContactPauseDocument = gql`
  mutation CampaignContactPause($input: CampaignContactPauseInput!) {
    campaignContactPause(input: $input) {
      id
      status
      statusReason
      updatedAt
    }
  }
`
export type CampaignContactPauseMutationFn = ApolloReactCommon.MutationFunction<
  CampaignContactPauseMutation,
  CampaignContactPauseMutationVariables
>

/**
 * __useCampaignContactPauseMutation__
 *
 * To run a mutation, you first call `useCampaignContactPauseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCampaignContactPauseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [campaignContactPauseMutation, { data, loading, error }] = useCampaignContactPauseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCampaignContactPauseMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CampaignContactPauseMutation,
    CampaignContactPauseMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CampaignContactPauseMutation,
    CampaignContactPauseMutationVariables
  >(CampaignContactPauseDocument, options)
}
export type CampaignContactPauseMutationHookResult = ReturnType<
  typeof useCampaignContactPauseMutation
>
export type CampaignContactPauseMutationResult =
  ApolloReactCommon.MutationResult<CampaignContactPauseMutation>
export type CampaignContactPauseMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CampaignContactPauseMutation,
  CampaignContactPauseMutationVariables
>
export const CampaignContactContinueDocument = gql`
  mutation CampaignContactContinue($input: CampaignContactContinueInput!) {
    campaignContactContinue(input: $input) {
      id
      status
      statusReason
      updatedAt
    }
  }
`
export type CampaignContactContinueMutationFn = ApolloReactCommon.MutationFunction<
  CampaignContactContinueMutation,
  CampaignContactContinueMutationVariables
>

/**
 * __useCampaignContactContinueMutation__
 *
 * To run a mutation, you first call `useCampaignContactContinueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCampaignContactContinueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [campaignContactContinueMutation, { data, loading, error }] = useCampaignContactContinueMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCampaignContactContinueMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CampaignContactContinueMutation,
    CampaignContactContinueMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CampaignContactContinueMutation,
    CampaignContactContinueMutationVariables
  >(CampaignContactContinueDocument, options)
}
export type CampaignContactContinueMutationHookResult = ReturnType<
  typeof useCampaignContactContinueMutation
>
export type CampaignContactContinueMutationResult =
  ApolloReactCommon.MutationResult<CampaignContactContinueMutation>
export type CampaignContactContinueMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CampaignContactContinueMutation,
  CampaignContactContinueMutationVariables
>
