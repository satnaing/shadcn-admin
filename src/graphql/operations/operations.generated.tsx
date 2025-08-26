import { gql } from '@apollo/client'
import type * as ApolloReactCommon from '@apollo/client'
import * as ApolloReactHooks from '@apollo/client'
import type * as Types from '../global/types.generated'

const defaultOptions = {} as const
export type IntegrationsQueryVariables = Types.Exact<{ [key: string]: never }>

export type IntegrationsQuery = {
  __typename?: 'Query'
  integrations?: { __typename?: 'IntegrationsOutput'; apps: Array<string> } | null
}

export type SlackIntegrationQueryVariables = Types.Exact<{ [key: string]: never }>

export type SlackIntegrationQuery = {
  __typename?: 'Query'
  slackIntegration?: {
    __typename?: 'SlackIntegration'
    enabled: boolean
    channelId: string
    slackTeamId?: string | null
    channelName: string
    notificationsType: Types.SlackNotificationsType
    sendDailyDigest: boolean
    sendPlayReminders: boolean
    inboxChannel?: any | null
  } | null
}

export type CrmIntegrationQueryVariables = Types.Exact<{ [key: string]: never }>

export type CrmIntegrationQuery = {
  __typename?: 'Query'
  crmIntegration?: {
    __typename?: 'CrmIntegration'
    id: string
    createdAt: any
    app: Types.CrmApp
    enabled: boolean
    updatedAt: any
    companiesToCreate: Types.CrmCompanyCreate
    contactsToCreate: Types.CrmContactCreate
    excludeLists: any
    notesToCreate: Types.CrmNoteCreate
    excludeContactsWithoutEmail: boolean
  } | null
}

export type CrmListsQueryVariables = Types.Exact<{
  q?: Types.InputMaybe<Types.Scalars['String']['input']>
}>

export type CrmListsQuery = {
  __typename?: 'Query'
  crmLists: {
    __typename?: 'CrmListResponse'
    data: Array<{
      __typename?: 'CrmList'
      listId: string
      name: string
      createdAt?: any | null
      updatedAt?: any | null
    }>
  }
}

export type SlackChannelsQueryVariables = Types.Exact<{ [key: string]: never }>

export type SlackChannelsQuery = {
  __typename?: 'Query'
  slackChannels?: Array<{ __typename?: 'SlackChannel'; id: string; name: string }> | null
}

export type SlackUsersQueryVariables = Types.Exact<{
  channelId: Types.Scalars['String']['input']
}>

export type SlackUsersQuery = {
  __typename?: 'Query'
  slackUsers?: Array<{
    __typename?: 'SlackUser'
    id: string
    name: string
    realName: string
    email?: string | null
    isBot?: boolean | null
  }> | null
}

export type SlackIntegrationUpdateMutationVariables = Types.Exact<{
  input: Types.SlackIntegrationUpdateInput
}>

export type SlackIntegrationUpdateMutation = {
  __typename?: 'Mutation'
  slackIntegrationUpdate: { __typename?: 'GenericResolverResponse'; success: boolean }
}

export type CrmIntegrationUpdateMutationVariables = Types.Exact<{
  input: Types.CrmIntegrationUpdateInput
}>

export type CrmIntegrationUpdateMutation = {
  __typename?: 'Mutation'
  crmIntegrationUpdate: {
    __typename?: 'CrmIntegration'
    id: string
    createdAt: any
    app: Types.CrmApp
    enabled: boolean
    updatedAt: any
    companiesToCreate: Types.CrmCompanyCreate
    contactsToCreate: Types.CrmContactCreate
    excludeLists: any
    notesToCreate: Types.CrmNoteCreate
    excludeContactsWithoutEmail: boolean
  }
}

export type OauthLoginMutationVariables = Types.Exact<{
  input: Types.OauthLoginInput
}>

export type OauthLoginMutation = {
  __typename?: 'Mutation'
  oauthLogin: { __typename?: 'GenericResolverResponse'; success: boolean }
}

export type UserLoginMutationVariables = Types.Exact<{
  input?: Types.InputMaybe<Types.UserLoginInput>
}>

export type UserLoginMutation = {
  __typename?: 'Mutation'
  userLogin: {
    __typename?: 'User'
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    onboardingStatus: Types.OnboardingStatus
  }
}

export type SubscriptionQueryVariables = Types.Exact<{ [key: string]: never }>

export type SubscriptionQuery = {
  __typename?: 'Query'
  subscription?: {
    __typename?: 'Subscription'
    id: string
    status: Types.SubscriptionStatus
    plan: Types.SubscriptionPlan
    startedAt: any
    renewsAt?: any | null
    interval: Types.SubscriptionInterval
    credits: number
    creditsUsed: number
  } | null
}

export type OrgInfoQueryVariables = Types.Exact<{ [key: string]: never }>

export type OrgInfoQuery = {
  __typename?: 'Query'
  orgInfo?: {
    __typename?: 'OrgInfo'
    id: string
    name?: string | null
    description?: string | null
    competitors?: string | null
    createdAt: any
    updatedAt: any
  } | null
}

export type OrgsQueryVariables = Types.Exact<{ [key: string]: never }>

export type OrgsQuery = {
  __typename?: 'Query'
  org: Array<{ __typename?: 'Org'; id: string; domain: string }>
}

export type OrgInfoUpdateMutationVariables = Types.Exact<{
  input: Types.OrgInfoUpdateInput
}>

export type OrgInfoUpdateMutation = {
  __typename?: 'Mutation'
  orgInfoUpdate: {
    __typename?: 'OrgInfo'
    id: string
    name?: string | null
    description?: string | null
    competitors?: string | null
    createdAt: any
    updatedAt: any
  }
}

export const IntegrationsDocument = gql`
  query Integrations {
    integrations {
      apps
    }
  }
`

/**
 * __useIntegrationsQuery__
 *
 * To run a query within a React component, call `useIntegrationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useIntegrationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIntegrationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useIntegrationsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<IntegrationsQuery, IntegrationsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<IntegrationsQuery, IntegrationsQueryVariables>(
    IntegrationsDocument,
    options
  )
}
export function useIntegrationsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IntegrationsQuery, IntegrationsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<IntegrationsQuery, IntegrationsQueryVariables>(
    IntegrationsDocument,
    options
  )
}
export function useIntegrationsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<IntegrationsQuery, IntegrationsQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<IntegrationsQuery, IntegrationsQueryVariables>(
    IntegrationsDocument,
    options
  )
}
export type IntegrationsQueryHookResult = ReturnType<typeof useIntegrationsQuery>
export type IntegrationsLazyQueryHookResult = ReturnType<typeof useIntegrationsLazyQuery>
export type IntegrationsSuspenseQueryHookResult = ReturnType<typeof useIntegrationsSuspenseQuery>
export type IntegrationsQueryResult = ApolloReactCommon.QueryResult<
  IntegrationsQuery,
  IntegrationsQueryVariables
>
export const SlackIntegrationDocument = gql`
  query SlackIntegration {
    slackIntegration {
      enabled
      channelId
      slackTeamId
      channelName
      notificationsType
      sendDailyDigest
      sendPlayReminders
      inboxChannel
    }
  }
`

/**
 * __useSlackIntegrationQuery__
 *
 * To run a query within a React component, call `useSlackIntegrationQuery` and pass it any options that fit your needs.
 * When your component renders, `useSlackIntegrationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSlackIntegrationQuery({
 *   variables: {
 *   },
 * });
 */
export function useSlackIntegrationQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SlackIntegrationQuery,
    SlackIntegrationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<SlackIntegrationQuery, SlackIntegrationQueryVariables>(
    SlackIntegrationDocument,
    options
  )
}
export function useSlackIntegrationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SlackIntegrationQuery,
    SlackIntegrationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<SlackIntegrationQuery, SlackIntegrationQueryVariables>(
    SlackIntegrationDocument,
    options
  )
}
export function useSlackIntegrationSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        SlackIntegrationQuery,
        SlackIntegrationQueryVariables
      >
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<SlackIntegrationQuery, SlackIntegrationQueryVariables>(
    SlackIntegrationDocument,
    options
  )
}
export type SlackIntegrationQueryHookResult = ReturnType<typeof useSlackIntegrationQuery>
export type SlackIntegrationLazyQueryHookResult = ReturnType<typeof useSlackIntegrationLazyQuery>
export type SlackIntegrationSuspenseQueryHookResult = ReturnType<
  typeof useSlackIntegrationSuspenseQuery
>
export type SlackIntegrationQueryResult = ApolloReactCommon.QueryResult<
  SlackIntegrationQuery,
  SlackIntegrationQueryVariables
>
export const CrmIntegrationDocument = gql`
  query CrmIntegration {
    crmIntegration {
      id
      createdAt
      app
      enabled
      updatedAt
      companiesToCreate
      contactsToCreate
      excludeLists
      notesToCreate
      excludeContactsWithoutEmail
    }
  }
`

/**
 * __useCrmIntegrationQuery__
 *
 * To run a query within a React component, call `useCrmIntegrationQuery` and pass it any options that fit your needs.
 * When your component renders, `useCrmIntegrationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCrmIntegrationQuery({
 *   variables: {
 *   },
 * });
 */
export function useCrmIntegrationQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<CrmIntegrationQuery, CrmIntegrationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<CrmIntegrationQuery, CrmIntegrationQueryVariables>(
    CrmIntegrationDocument,
    options
  )
}
export function useCrmIntegrationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CrmIntegrationQuery,
    CrmIntegrationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<CrmIntegrationQuery, CrmIntegrationQueryVariables>(
    CrmIntegrationDocument,
    options
  )
}
export function useCrmIntegrationSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<CrmIntegrationQuery, CrmIntegrationQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<CrmIntegrationQuery, CrmIntegrationQueryVariables>(
    CrmIntegrationDocument,
    options
  )
}
export type CrmIntegrationQueryHookResult = ReturnType<typeof useCrmIntegrationQuery>
export type CrmIntegrationLazyQueryHookResult = ReturnType<typeof useCrmIntegrationLazyQuery>
export type CrmIntegrationSuspenseQueryHookResult = ReturnType<
  typeof useCrmIntegrationSuspenseQuery
>
export type CrmIntegrationQueryResult = ApolloReactCommon.QueryResult<
  CrmIntegrationQuery,
  CrmIntegrationQueryVariables
>
export const CrmListsDocument = gql`
  query CrmLists($q: String) {
    crmLists(query: $q) {
      data {
        listId
        name
        createdAt
        updatedAt
      }
    }
  }
`

/**
 * __useCrmListsQuery__
 *
 * To run a query within a React component, call `useCrmListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCrmListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCrmListsQuery({
 *   variables: {
 *      q: // value for 'q'
 *   },
 * });
 */
export function useCrmListsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<CrmListsQuery, CrmListsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<CrmListsQuery, CrmListsQueryVariables>(CrmListsDocument, options)
}
export function useCrmListsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CrmListsQuery, CrmListsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<CrmListsQuery, CrmListsQueryVariables>(
    CrmListsDocument,
    options
  )
}
export function useCrmListsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<CrmListsQuery, CrmListsQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<CrmListsQuery, CrmListsQueryVariables>(
    CrmListsDocument,
    options
  )
}
export type CrmListsQueryHookResult = ReturnType<typeof useCrmListsQuery>
export type CrmListsLazyQueryHookResult = ReturnType<typeof useCrmListsLazyQuery>
export type CrmListsSuspenseQueryHookResult = ReturnType<typeof useCrmListsSuspenseQuery>
export type CrmListsQueryResult = ApolloReactCommon.QueryResult<
  CrmListsQuery,
  CrmListsQueryVariables
>
export const SlackChannelsDocument = gql`
  query SlackChannels {
    slackChannels {
      id
      name
    }
  }
`

/**
 * __useSlackChannelsQuery__
 *
 * To run a query within a React component, call `useSlackChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSlackChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSlackChannelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSlackChannelsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<SlackChannelsQuery, SlackChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<SlackChannelsQuery, SlackChannelsQueryVariables>(
    SlackChannelsDocument,
    options
  )
}
export function useSlackChannelsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SlackChannelsQuery,
    SlackChannelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<SlackChannelsQuery, SlackChannelsQueryVariables>(
    SlackChannelsDocument,
    options
  )
}
export function useSlackChannelsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<SlackChannelsQuery, SlackChannelsQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<SlackChannelsQuery, SlackChannelsQueryVariables>(
    SlackChannelsDocument,
    options
  )
}
export type SlackChannelsQueryHookResult = ReturnType<typeof useSlackChannelsQuery>
export type SlackChannelsLazyQueryHookResult = ReturnType<typeof useSlackChannelsLazyQuery>
export type SlackChannelsSuspenseQueryHookResult = ReturnType<typeof useSlackChannelsSuspenseQuery>
export type SlackChannelsQueryResult = ApolloReactCommon.QueryResult<
  SlackChannelsQuery,
  SlackChannelsQueryVariables
>
export const SlackUsersDocument = gql`
  query SlackUsers($channelId: String!) {
    slackUsers(channelId: $channelId) {
      id
      name
      realName
      email
      isBot
    }
  }
`

/**
 * __useSlackUsersQuery__
 *
 * To run a query within a React component, call `useSlackUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSlackUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSlackUsersQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useSlackUsersQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<SlackUsersQuery, SlackUsersQueryVariables> &
    ({ variables: SlackUsersQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<SlackUsersQuery, SlackUsersQueryVariables>(
    SlackUsersDocument,
    options
  )
}
export function useSlackUsersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SlackUsersQuery, SlackUsersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<SlackUsersQuery, SlackUsersQueryVariables>(
    SlackUsersDocument,
    options
  )
}
export function useSlackUsersSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<SlackUsersQuery, SlackUsersQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<SlackUsersQuery, SlackUsersQueryVariables>(
    SlackUsersDocument,
    options
  )
}
export type SlackUsersQueryHookResult = ReturnType<typeof useSlackUsersQuery>
export type SlackUsersLazyQueryHookResult = ReturnType<typeof useSlackUsersLazyQuery>
export type SlackUsersSuspenseQueryHookResult = ReturnType<typeof useSlackUsersSuspenseQuery>
export type SlackUsersQueryResult = ApolloReactCommon.QueryResult<
  SlackUsersQuery,
  SlackUsersQueryVariables
>
export const SlackIntegrationUpdateDocument = gql`
  mutation SlackIntegrationUpdate($input: SlackIntegrationUpdateInput!) {
    slackIntegrationUpdate(input: $input) {
      success
    }
  }
`
export type SlackIntegrationUpdateMutationFn = ApolloReactCommon.MutationFunction<
  SlackIntegrationUpdateMutation,
  SlackIntegrationUpdateMutationVariables
>

/**
 * __useSlackIntegrationUpdateMutation__
 *
 * To run a mutation, you first call `useSlackIntegrationUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSlackIntegrationUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [slackIntegrationUpdateMutation, { data, loading, error }] = useSlackIntegrationUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSlackIntegrationUpdateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SlackIntegrationUpdateMutation,
    SlackIntegrationUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SlackIntegrationUpdateMutation,
    SlackIntegrationUpdateMutationVariables
  >(SlackIntegrationUpdateDocument, options)
}
export type SlackIntegrationUpdateMutationHookResult = ReturnType<
  typeof useSlackIntegrationUpdateMutation
>
export type SlackIntegrationUpdateMutationResult =
  ApolloReactCommon.MutationResult<SlackIntegrationUpdateMutation>
export type SlackIntegrationUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SlackIntegrationUpdateMutation,
  SlackIntegrationUpdateMutationVariables
>
export const CrmIntegrationUpdateDocument = gql`
  mutation CrmIntegrationUpdate($input: CrmIntegrationUpdateInput!) {
    crmIntegrationUpdate(input: $input) {
      id
      createdAt
      app
      enabled
      updatedAt
      companiesToCreate
      contactsToCreate
      excludeLists
      notesToCreate
      excludeContactsWithoutEmail
    }
  }
`
export type CrmIntegrationUpdateMutationFn = ApolloReactCommon.MutationFunction<
  CrmIntegrationUpdateMutation,
  CrmIntegrationUpdateMutationVariables
>

/**
 * __useCrmIntegrationUpdateMutation__
 *
 * To run a mutation, you first call `useCrmIntegrationUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCrmIntegrationUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [crmIntegrationUpdateMutation, { data, loading, error }] = useCrmIntegrationUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCrmIntegrationUpdateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CrmIntegrationUpdateMutation,
    CrmIntegrationUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CrmIntegrationUpdateMutation,
    CrmIntegrationUpdateMutationVariables
  >(CrmIntegrationUpdateDocument, options)
}
export type CrmIntegrationUpdateMutationHookResult = ReturnType<
  typeof useCrmIntegrationUpdateMutation
>
export type CrmIntegrationUpdateMutationResult =
  ApolloReactCommon.MutationResult<CrmIntegrationUpdateMutation>
export type CrmIntegrationUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CrmIntegrationUpdateMutation,
  CrmIntegrationUpdateMutationVariables
>
export const OauthLoginDocument = gql`
  mutation OauthLogin($input: OauthLoginInput!) {
    oauthLogin(input: $input) {
      success
    }
  }
`
export type OauthLoginMutationFn = ApolloReactCommon.MutationFunction<
  OauthLoginMutation,
  OauthLoginMutationVariables
>

/**
 * __useOauthLoginMutation__
 *
 * To run a mutation, you first call `useOauthLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOauthLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [oauthLoginMutation, { data, loading, error }] = useOauthLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOauthLoginMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    OauthLoginMutation,
    OauthLoginMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<OauthLoginMutation, OauthLoginMutationVariables>(
    OauthLoginDocument,
    options
  )
}
export type OauthLoginMutationHookResult = ReturnType<typeof useOauthLoginMutation>
export type OauthLoginMutationResult = ApolloReactCommon.MutationResult<OauthLoginMutation>
export type OauthLoginMutationOptions = ApolloReactCommon.BaseMutationOptions<
  OauthLoginMutation,
  OauthLoginMutationVariables
>
export const UserLoginDocument = gql`
  mutation UserLogin($input: UserLoginInput) {
    userLogin(input: $input) {
      id
      email
      firstName
      lastName
      onboardingStatus
    }
  }
`
export type UserLoginMutationFn = ApolloReactCommon.MutationFunction<
  UserLoginMutation,
  UserLoginMutationVariables
>

/**
 * __useUserLoginMutation__
 *
 * To run a mutation, you first call `useUserLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userLoginMutation, { data, loading, error }] = useUserLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserLoginMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<UserLoginMutation, UserLoginMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<UserLoginMutation, UserLoginMutationVariables>(
    UserLoginDocument,
    options
  )
}
export type UserLoginMutationHookResult = ReturnType<typeof useUserLoginMutation>
export type UserLoginMutationResult = ApolloReactCommon.MutationResult<UserLoginMutation>
export type UserLoginMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UserLoginMutation,
  UserLoginMutationVariables
>
export const SubscriptionDocument = gql`
  query Subscription {
    subscription {
      id
      status
      plan
      startedAt
      renewsAt
      interval
      credits
      creditsUsed
    }
  }
`

/**
 * __useSubscriptionQuery__
 *
 * To run a query within a React component, call `useSubscriptionQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionQuery({
 *   variables: {
 *   },
 * });
 */
export function useSubscriptionQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<SubscriptionQuery, SubscriptionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<SubscriptionQuery, SubscriptionQueryVariables>(
    SubscriptionDocument,
    options
  )
}
export function useSubscriptionLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SubscriptionQuery, SubscriptionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<SubscriptionQuery, SubscriptionQueryVariables>(
    SubscriptionDocument,
    options
  )
}
export function useSubscriptionSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<SubscriptionQuery, SubscriptionQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<SubscriptionQuery, SubscriptionQueryVariables>(
    SubscriptionDocument,
    options
  )
}
export type SubscriptionQueryHookResult = ReturnType<typeof useSubscriptionQuery>
export type SubscriptionLazyQueryHookResult = ReturnType<typeof useSubscriptionLazyQuery>
export type SubscriptionSuspenseQueryHookResult = ReturnType<typeof useSubscriptionSuspenseQuery>
export type SubscriptionQueryResult = ApolloReactCommon.QueryResult<
  SubscriptionQuery,
  SubscriptionQueryVariables
>
export const OrgInfoDocument = gql`
  query OrgInfo {
    orgInfo {
      id
      name
      description
      competitors
      createdAt
      updatedAt
    }
  }
`

/**
 * __useOrgInfoQuery__
 *
 * To run a query within a React component, call `useOrgInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrgInfoQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<OrgInfoQuery, OrgInfoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<OrgInfoQuery, OrgInfoQueryVariables>(OrgInfoDocument, options)
}
export function useOrgInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<OrgInfoQuery, OrgInfoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<OrgInfoQuery, OrgInfoQueryVariables>(
    OrgInfoDocument,
    options
  )
}
export function useOrgInfoSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<OrgInfoQuery, OrgInfoQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<OrgInfoQuery, OrgInfoQueryVariables>(
    OrgInfoDocument,
    options
  )
}
export type OrgInfoQueryHookResult = ReturnType<typeof useOrgInfoQuery>
export type OrgInfoLazyQueryHookResult = ReturnType<typeof useOrgInfoLazyQuery>
export type OrgInfoSuspenseQueryHookResult = ReturnType<typeof useOrgInfoSuspenseQuery>
export type OrgInfoQueryResult = ApolloReactCommon.QueryResult<OrgInfoQuery, OrgInfoQueryVariables>
export const OrgsDocument = gql`
  query Orgs {
    org {
      id
      domain
    }
  }
`

/**
 * __useOrgsQuery__
 *
 * To run a query within a React component, call `useOrgsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrgsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<OrgsQuery, OrgsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<OrgsQuery, OrgsQueryVariables>(OrgsDocument, options)
}
export function useOrgsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<OrgsQuery, OrgsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<OrgsQuery, OrgsQueryVariables>(OrgsDocument, options)
}
export function useOrgsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<OrgsQuery, OrgsQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<OrgsQuery, OrgsQueryVariables>(OrgsDocument, options)
}
export type OrgsQueryHookResult = ReturnType<typeof useOrgsQuery>
export type OrgsLazyQueryHookResult = ReturnType<typeof useOrgsLazyQuery>
export type OrgsSuspenseQueryHookResult = ReturnType<typeof useOrgsSuspenseQuery>
export type OrgsQueryResult = ApolloReactCommon.QueryResult<OrgsQuery, OrgsQueryVariables>
export const OrgInfoUpdateDocument = gql`
  mutation OrgInfoUpdate($input: OrgInfoUpdateInput!) {
    orgInfoUpdate(input: $input) {
      id
      name
      description
      competitors
      createdAt
      updatedAt
    }
  }
`
export type OrgInfoUpdateMutationFn = ApolloReactCommon.MutationFunction<
  OrgInfoUpdateMutation,
  OrgInfoUpdateMutationVariables
>

/**
 * __useOrgInfoUpdateMutation__
 *
 * To run a mutation, you first call `useOrgInfoUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrgInfoUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orgInfoUpdateMutation, { data, loading, error }] = useOrgInfoUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrgInfoUpdateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    OrgInfoUpdateMutation,
    OrgInfoUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<OrgInfoUpdateMutation, OrgInfoUpdateMutationVariables>(
    OrgInfoUpdateDocument,
    options
  )
}
export type OrgInfoUpdateMutationHookResult = ReturnType<typeof useOrgInfoUpdateMutation>
export type OrgInfoUpdateMutationResult = ApolloReactCommon.MutationResult<OrgInfoUpdateMutation>
export type OrgInfoUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  OrgInfoUpdateMutation,
  OrgInfoUpdateMutationVariables
>
