import { gql } from '@apollo/client'
import type * as ApolloReactCommon from '@apollo/client'
import * as ApolloReactHooks from '@apollo/client'
import type * as Types from '../../../graphql/global/types.generated'

const defaultOptions = {} as const
export type ConnectedAccountsQueryVariables = Types.Exact<{ [key: string]: never }>

export type ConnectedAccountsQuery = {
  __typename?: 'Query'
  connectedAccounts: Array<{
    __typename?: 'ConnectedAccount'
    id: string
    name: string
    profilePicUrl?: string | null
    isLinkedinEnabled: boolean
    dailyConnectionRequests: number
    dailyMessagesSent: number
    linkedinExternalId?: string | null
    isEmailEnabled: boolean
    emailProvider?: Types.EmailProvider | null
    emailExternalId?: string | null
    email?: string | null
    createdAt: any
  }>
}

export type ConnectAccountUrlMutationVariables = Types.Exact<{
  input: Types.ConnectedAccountConnectionUrlInput
}>

export type ConnectAccountUrlMutation = {
  __typename?: 'Mutation'
  connectedAccountConnectionUrl: { __typename?: 'ConnectedAccountConnectionUrl'; url: string }
}

export type ReconnectAccountUrlMutationVariables = Types.Exact<{
  input: Types.ConnectedAccountReconnectionUrlInput
}>

export type ReconnectAccountUrlMutation = {
  __typename?: 'Mutation'
  connectedAccountReconnectionUrl: { __typename?: 'ConnectedAccountConnectionUrl'; url: string }
}

export type ConnectedAccountDeleteMutationVariables = Types.Exact<{
  input: Types.ConnectedAccountDeleteInput
}>

export type ConnectedAccountDeleteMutation = {
  __typename?: 'Mutation'
  connectedAccountDelete: { __typename?: 'GenericResolverResponse'; count?: number | null }
}

export const ConnectedAccountsDocument = gql`
  query ConnectedAccounts {
    connectedAccounts {
      id
      name
      profilePicUrl
      isLinkedinEnabled
      dailyConnectionRequests
      dailyMessagesSent
      isLinkedinEnabled
      linkedinExternalId
      isEmailEnabled
      emailProvider
      emailExternalId
      email
      createdAt
    }
  }
`

/**
 * __useConnectedAccountsQuery__
 *
 * To run a query within a React component, call `useConnectedAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useConnectedAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConnectedAccountsQuery({
 *   variables: {
 *   },
 * });
 */
export function useConnectedAccountsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ConnectedAccountsQuery,
    ConnectedAccountsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ConnectedAccountsQuery, ConnectedAccountsQueryVariables>(
    ConnectedAccountsDocument,
    options
  )
}
export function useConnectedAccountsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ConnectedAccountsQuery,
    ConnectedAccountsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<ConnectedAccountsQuery, ConnectedAccountsQueryVariables>(
    ConnectedAccountsDocument,
    options
  )
}
export function useConnectedAccountsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        ConnectedAccountsQuery,
        ConnectedAccountsQueryVariables
      >
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<ConnectedAccountsQuery, ConnectedAccountsQueryVariables>(
    ConnectedAccountsDocument,
    options
  )
}
export type ConnectedAccountsQueryHookResult = ReturnType<typeof useConnectedAccountsQuery>
export type ConnectedAccountsLazyQueryHookResult = ReturnType<typeof useConnectedAccountsLazyQuery>
export type ConnectedAccountsSuspenseQueryHookResult = ReturnType<
  typeof useConnectedAccountsSuspenseQuery
>
export type ConnectedAccountsQueryResult = ApolloReactCommon.QueryResult<
  ConnectedAccountsQuery,
  ConnectedAccountsQueryVariables
>
export const ConnectAccountUrlDocument = gql`
  mutation ConnectAccountUrl($input: ConnectedAccountConnectionUrlInput!) {
    connectedAccountConnectionUrl(input: $input) {
      url
    }
  }
`
export type ConnectAccountUrlMutationFn = ApolloReactCommon.MutationFunction<
  ConnectAccountUrlMutation,
  ConnectAccountUrlMutationVariables
>

/**
 * __useConnectAccountUrlMutation__
 *
 * To run a mutation, you first call `useConnectAccountUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConnectAccountUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [connectAccountUrlMutation, { data, loading, error }] = useConnectAccountUrlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useConnectAccountUrlMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ConnectAccountUrlMutation,
    ConnectAccountUrlMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ConnectAccountUrlMutation,
    ConnectAccountUrlMutationVariables
  >(ConnectAccountUrlDocument, options)
}
export type ConnectAccountUrlMutationHookResult = ReturnType<typeof useConnectAccountUrlMutation>
export type ConnectAccountUrlMutationResult =
  ApolloReactCommon.MutationResult<ConnectAccountUrlMutation>
export type ConnectAccountUrlMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ConnectAccountUrlMutation,
  ConnectAccountUrlMutationVariables
>
export const ReconnectAccountUrlDocument = gql`
  mutation ReconnectAccountUrl($input: ConnectedAccountReconnectionUrlInput!) {
    connectedAccountReconnectionUrl(input: $input) {
      url
    }
  }
`
export type ReconnectAccountUrlMutationFn = ApolloReactCommon.MutationFunction<
  ReconnectAccountUrlMutation,
  ReconnectAccountUrlMutationVariables
>

/**
 * __useReconnectAccountUrlMutation__
 *
 * To run a mutation, you first call `useReconnectAccountUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReconnectAccountUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reconnectAccountUrlMutation, { data, loading, error }] = useReconnectAccountUrlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReconnectAccountUrlMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ReconnectAccountUrlMutation,
    ReconnectAccountUrlMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ReconnectAccountUrlMutation,
    ReconnectAccountUrlMutationVariables
  >(ReconnectAccountUrlDocument, options)
}
export type ReconnectAccountUrlMutationHookResult = ReturnType<
  typeof useReconnectAccountUrlMutation
>
export type ReconnectAccountUrlMutationResult =
  ApolloReactCommon.MutationResult<ReconnectAccountUrlMutation>
export type ReconnectAccountUrlMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ReconnectAccountUrlMutation,
  ReconnectAccountUrlMutationVariables
>
export const ConnectedAccountDeleteDocument = gql`
  mutation ConnectedAccountDelete($input: ConnectedAccountDeleteInput!) {
    connectedAccountDelete(input: $input) {
      count
    }
  }
`
export type ConnectedAccountDeleteMutationFn = ApolloReactCommon.MutationFunction<
  ConnectedAccountDeleteMutation,
  ConnectedAccountDeleteMutationVariables
>

/**
 * __useConnectedAccountDeleteMutation__
 *
 * To run a mutation, you first call `useConnectedAccountDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConnectedAccountDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [connectedAccountDeleteMutation, { data, loading, error }] = useConnectedAccountDeleteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useConnectedAccountDeleteMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ConnectedAccountDeleteMutation,
    ConnectedAccountDeleteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ConnectedAccountDeleteMutation,
    ConnectedAccountDeleteMutationVariables
  >(ConnectedAccountDeleteDocument, options)
}
export type ConnectedAccountDeleteMutationHookResult = ReturnType<
  typeof useConnectedAccountDeleteMutation
>
export type ConnectedAccountDeleteMutationResult =
  ApolloReactCommon.MutationResult<ConnectedAccountDeleteMutation>
export type ConnectedAccountDeleteMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ConnectedAccountDeleteMutation,
  ConnectedAccountDeleteMutationVariables
>
