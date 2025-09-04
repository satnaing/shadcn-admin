import { gql } from '@apollo/client'
import type * as ApolloReactCommon from '@apollo/client'
import * as ApolloReactHooks from '@apollo/client'
import type * as Types from '../../../graphql/global/types.generated'

const defaultOptions = {} as const
export type PlaybooksQueryVariables = Types.Exact<{ [key: string]: never }>

export type PlaybooksQuery = {
  __typename?: 'Query'
  playbooks: Array<{
    __typename?: 'Playbook'
    id: string
    name: string
    description?: string | null
    isEnabled: boolean
    createdAt: any
    updatedAt: any
    deletedAt?: any | null
    scenarioCount: number
  }>
}

export type PlaybookQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input']
}>

export type PlaybookQuery = {
  __typename?: 'Query'
  playbook: {
    __typename?: 'Playbook'
    id: string
    name: string
    description?: string | null
    isEnabled: boolean
    createdAt: any
    updatedAt: any
    deletedAt?: any | null
    outreachInstructions?: string | null
    scenarios: Array<{
      __typename?: 'PlaybookScenario'
      id: string
      name: string
      description?: string | null
      actionPlan: string
      updatedAt: any
      createdAt: any
    }>
  }
}

export type PlaybookUpdateMutationVariables = Types.Exact<{
  input: Types.PlaybookUpdateInput
}>

export type PlaybookUpdateMutation = {
  __typename?: 'Mutation'
  playbookUpdate: {
    __typename?: 'Playbook'
    id: string
    name: string
    description?: string | null
    isEnabled: boolean
    outreachInstructions?: string | null
    createdAt: any
    updatedAt: any
    deletedAt?: any | null
    orgId: string
  }
}

export type PlaybookScenarioCreateMutationVariables = Types.Exact<{
  input: Types.PlaybookScenarioCreateInput
}>

export type PlaybookScenarioCreateMutation = {
  __typename?: 'Mutation'
  playbookScenarioCreate: {
    __typename?: 'PlaybookScenario'
    id: string
    name: string
    description?: string | null
    actionPlan: string
    createdAt: any
    updatedAt: any
    playbookId: string
  }
}

export type PlaybookScenarioUpdateMutationVariables = Types.Exact<{
  input: Types.PlaybookScenarioUpdateInput
}>

export type PlaybookScenarioUpdateMutation = {
  __typename?: 'Mutation'
  playbookScenarioUpdate: {
    __typename?: 'PlaybookScenario'
    id: string
    name: string
    description?: string | null
    actionPlan: string
    createdAt: any
    updatedAt: any
    playbookId: string
  }
}

export type PlaybookScenariosDeleteMutationVariables = Types.Exact<{
  input: Types.BatchModelDeleteInput
}>

export type PlaybookScenariosDeleteMutation = {
  __typename?: 'Mutation'
  playbookScenariosDelete: {
    __typename?: 'GenericResolverResponse'
    success: boolean
    count?: number | null
  }
}

export type TriggersQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.TriggerFilters>
}>

export type TriggersQuery = {
  __typename?: 'Query'
  triggers: Array<{
    __typename?: 'Trigger'
    id: string
    name: string
    type: Types.TriggerType
    description?: string | null
    config: any
    isEnabled: boolean
    createdAt: any
    updatedAt: any
    playbookId?: string | null
    orgId: string
    excludeLists: any
  }>
}

export type TriggerUpdateMutationVariables = Types.Exact<{
  input: Types.TriggerUpdateInput
}>

export type TriggerUpdateMutation = {
  __typename?: 'Mutation'
  triggerUpdate: { __typename?: 'Trigger'; id: string; excludeLists: any }
}

export type TrackingScriptQueryVariables = Types.Exact<{ [key: string]: never }>

export type TrackingScriptQuery = {
  __typename?: 'Query'
  trackingScript: {
    __typename?: 'TrackingScript'
    id: string
    pk: string
    domain?: string | null
    isVerified: boolean
    excludedPaths?: any | null
    allowedCountryCodes?: any | null
    minimumSessionTimeSec?: number | null
    identificationMode: Types.TrackingScriptIdentificationMode
    dailyLimit: number
    createdAt: any
    updatedAt: any
  }
}

export type TrackingScriptUpdateMutationVariables = Types.Exact<{
  input: Types.TrackingScriptUpdateInput
}>

export type TrackingScriptUpdateMutation = {
  __typename?: 'Mutation'
  trackingScriptUpdate: {
    __typename?: 'TrackingScript'
    id: string
    domain?: string | null
    isVerified: boolean
    excludedPaths?: any | null
    allowedCountryCodes?: any | null
    minimumSessionTimeSec?: number | null
    identificationMode: Types.TrackingScriptIdentificationMode
    dailyLimit: number
    createdAt: any
    updatedAt: any
  }
}

export type TrackingScriptDomainUpdateMutationVariables = Types.Exact<{
  input: Types.TrackingScriptDomainUpdateInput
}>

export type TrackingScriptDomainUpdateMutation = {
  __typename?: 'Mutation'
  trackingScriptDomainUpdate: {
    __typename?: 'TrackingScript'
    id: string
    pk: string
    domain?: string | null
    isVerified: boolean
    excludedPaths?: any | null
    allowedCountryCodes?: any | null
    minimumSessionTimeSec?: number | null
    identificationMode: Types.TrackingScriptIdentificationMode
    dailyLimit: number
    createdAt: any
    updatedAt: any
  }
}

export const PlaybooksDocument = gql`
  query Playbooks {
    playbooks {
      id
      name
      description
      isEnabled
      createdAt
      updatedAt
      deletedAt
      scenarioCount
    }
  }
`

/**
 * __usePlaybooksQuery__
 *
 * To run a query within a React component, call `usePlaybooksQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaybooksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaybooksQuery({
 *   variables: {
 *   },
 * });
 */
export function usePlaybooksQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<PlaybooksQuery, PlaybooksQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<PlaybooksQuery, PlaybooksQueryVariables>(
    PlaybooksDocument,
    options
  )
}
export function usePlaybooksLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PlaybooksQuery, PlaybooksQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<PlaybooksQuery, PlaybooksQueryVariables>(
    PlaybooksDocument,
    options
  )
}
export function usePlaybooksSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<PlaybooksQuery, PlaybooksQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<PlaybooksQuery, PlaybooksQueryVariables>(
    PlaybooksDocument,
    options
  )
}
export type PlaybooksQueryHookResult = ReturnType<typeof usePlaybooksQuery>
export type PlaybooksLazyQueryHookResult = ReturnType<typeof usePlaybooksLazyQuery>
export type PlaybooksSuspenseQueryHookResult = ReturnType<typeof usePlaybooksSuspenseQuery>
export type PlaybooksQueryResult = ApolloReactCommon.QueryResult<
  PlaybooksQuery,
  PlaybooksQueryVariables
>
export const PlaybookDocument = gql`
  query Playbook($id: String!) {
    playbook(id: $id) {
      id
      name
      description
      isEnabled
      createdAt
      updatedAt
      deletedAt
      outreachInstructions
      scenarios {
        id
        name
        description
        actionPlan
        updatedAt
        createdAt
      }
    }
  }
`

/**
 * __usePlaybookQuery__
 *
 * To run a query within a React component, call `usePlaybookQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaybookQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaybookQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePlaybookQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<PlaybookQuery, PlaybookQueryVariables> &
    ({ variables: PlaybookQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<PlaybookQuery, PlaybookQueryVariables>(PlaybookDocument, options)
}
export function usePlaybookLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PlaybookQuery, PlaybookQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<PlaybookQuery, PlaybookQueryVariables>(
    PlaybookDocument,
    options
  )
}
export function usePlaybookSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<PlaybookQuery, PlaybookQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<PlaybookQuery, PlaybookQueryVariables>(
    PlaybookDocument,
    options
  )
}
export type PlaybookQueryHookResult = ReturnType<typeof usePlaybookQuery>
export type PlaybookLazyQueryHookResult = ReturnType<typeof usePlaybookLazyQuery>
export type PlaybookSuspenseQueryHookResult = ReturnType<typeof usePlaybookSuspenseQuery>
export type PlaybookQueryResult = ApolloReactCommon.QueryResult<
  PlaybookQuery,
  PlaybookQueryVariables
>
export const PlaybookUpdateDocument = gql`
  mutation PlaybookUpdate($input: PlaybookUpdateInput!) {
    playbookUpdate(input: $input) {
      id
      name
      description
      isEnabled
      outreachInstructions
      createdAt
      updatedAt
      deletedAt
      orgId
    }
  }
`
export type PlaybookUpdateMutationFn = ApolloReactCommon.MutationFunction<
  PlaybookUpdateMutation,
  PlaybookUpdateMutationVariables
>

/**
 * __usePlaybookUpdateMutation__
 *
 * To run a mutation, you first call `usePlaybookUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlaybookUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playbookUpdateMutation, { data, loading, error }] = usePlaybookUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePlaybookUpdateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PlaybookUpdateMutation,
    PlaybookUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<PlaybookUpdateMutation, PlaybookUpdateMutationVariables>(
    PlaybookUpdateDocument,
    options
  )
}
export type PlaybookUpdateMutationHookResult = ReturnType<typeof usePlaybookUpdateMutation>
export type PlaybookUpdateMutationResult = ApolloReactCommon.MutationResult<PlaybookUpdateMutation>
export type PlaybookUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PlaybookUpdateMutation,
  PlaybookUpdateMutationVariables
>
export const PlaybookScenarioCreateDocument = gql`
  mutation PlaybookScenarioCreate($input: PlaybookScenarioCreateInput!) {
    playbookScenarioCreate(input: $input) {
      id
      name
      description
      actionPlan
      createdAt
      updatedAt
      playbookId
    }
  }
`
export type PlaybookScenarioCreateMutationFn = ApolloReactCommon.MutationFunction<
  PlaybookScenarioCreateMutation,
  PlaybookScenarioCreateMutationVariables
>

/**
 * __usePlaybookScenarioCreateMutation__
 *
 * To run a mutation, you first call `usePlaybookScenarioCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlaybookScenarioCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playbookScenarioCreateMutation, { data, loading, error }] = usePlaybookScenarioCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePlaybookScenarioCreateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PlaybookScenarioCreateMutation,
    PlaybookScenarioCreateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    PlaybookScenarioCreateMutation,
    PlaybookScenarioCreateMutationVariables
  >(PlaybookScenarioCreateDocument, options)
}
export type PlaybookScenarioCreateMutationHookResult = ReturnType<
  typeof usePlaybookScenarioCreateMutation
>
export type PlaybookScenarioCreateMutationResult =
  ApolloReactCommon.MutationResult<PlaybookScenarioCreateMutation>
export type PlaybookScenarioCreateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PlaybookScenarioCreateMutation,
  PlaybookScenarioCreateMutationVariables
>
export const PlaybookScenarioUpdateDocument = gql`
  mutation PlaybookScenarioUpdate($input: PlaybookScenarioUpdateInput!) {
    playbookScenarioUpdate(input: $input) {
      id
      name
      description
      actionPlan
      createdAt
      updatedAt
      playbookId
    }
  }
`
export type PlaybookScenarioUpdateMutationFn = ApolloReactCommon.MutationFunction<
  PlaybookScenarioUpdateMutation,
  PlaybookScenarioUpdateMutationVariables
>

/**
 * __usePlaybookScenarioUpdateMutation__
 *
 * To run a mutation, you first call `usePlaybookScenarioUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlaybookScenarioUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playbookScenarioUpdateMutation, { data, loading, error }] = usePlaybookScenarioUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePlaybookScenarioUpdateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PlaybookScenarioUpdateMutation,
    PlaybookScenarioUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    PlaybookScenarioUpdateMutation,
    PlaybookScenarioUpdateMutationVariables
  >(PlaybookScenarioUpdateDocument, options)
}
export type PlaybookScenarioUpdateMutationHookResult = ReturnType<
  typeof usePlaybookScenarioUpdateMutation
>
export type PlaybookScenarioUpdateMutationResult =
  ApolloReactCommon.MutationResult<PlaybookScenarioUpdateMutation>
export type PlaybookScenarioUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PlaybookScenarioUpdateMutation,
  PlaybookScenarioUpdateMutationVariables
>
export const PlaybookScenariosDeleteDocument = gql`
  mutation PlaybookScenariosDelete($input: BatchModelDeleteInput!) {
    playbookScenariosDelete(input: $input) {
      success
      count
    }
  }
`
export type PlaybookScenariosDeleteMutationFn = ApolloReactCommon.MutationFunction<
  PlaybookScenariosDeleteMutation,
  PlaybookScenariosDeleteMutationVariables
>

/**
 * __usePlaybookScenariosDeleteMutation__
 *
 * To run a mutation, you first call `usePlaybookScenariosDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlaybookScenariosDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playbookScenariosDeleteMutation, { data, loading, error }] = usePlaybookScenariosDeleteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePlaybookScenariosDeleteMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PlaybookScenariosDeleteMutation,
    PlaybookScenariosDeleteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    PlaybookScenariosDeleteMutation,
    PlaybookScenariosDeleteMutationVariables
  >(PlaybookScenariosDeleteDocument, options)
}
export type PlaybookScenariosDeleteMutationHookResult = ReturnType<
  typeof usePlaybookScenariosDeleteMutation
>
export type PlaybookScenariosDeleteMutationResult =
  ApolloReactCommon.MutationResult<PlaybookScenariosDeleteMutation>
export type PlaybookScenariosDeleteMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PlaybookScenariosDeleteMutation,
  PlaybookScenariosDeleteMutationVariables
>
export const TriggersDocument = gql`
  query Triggers($filters: TriggerFilters) {
    triggers(filters: $filters) {
      id
      name
      type
      description
      config
      isEnabled
      createdAt
      updatedAt
      playbookId
      orgId
      excludeLists
    }
  }
`

/**
 * __useTriggersQuery__
 *
 * To run a query within a React component, call `useTriggersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTriggersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTriggersQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useTriggersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<TriggersQuery, TriggersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<TriggersQuery, TriggersQueryVariables>(TriggersDocument, options)
}
export function useTriggersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TriggersQuery, TriggersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<TriggersQuery, TriggersQueryVariables>(
    TriggersDocument,
    options
  )
}
export function useTriggersSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<TriggersQuery, TriggersQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<TriggersQuery, TriggersQueryVariables>(
    TriggersDocument,
    options
  )
}
export type TriggersQueryHookResult = ReturnType<typeof useTriggersQuery>
export type TriggersLazyQueryHookResult = ReturnType<typeof useTriggersLazyQuery>
export type TriggersSuspenseQueryHookResult = ReturnType<typeof useTriggersSuspenseQuery>
export type TriggersQueryResult = ApolloReactCommon.QueryResult<
  TriggersQuery,
  TriggersQueryVariables
>
export const TriggerUpdateDocument = gql`
  mutation TriggerUpdate($input: TriggerUpdateInput!) {
    triggerUpdate(input: $input) {
      id
      excludeLists
    }
  }
`
export type TriggerUpdateMutationFn = ApolloReactCommon.MutationFunction<
  TriggerUpdateMutation,
  TriggerUpdateMutationVariables
>

/**
 * __useTriggerUpdateMutation__
 *
 * To run a mutation, you first call `useTriggerUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTriggerUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [triggerUpdateMutation, { data, loading, error }] = useTriggerUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTriggerUpdateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    TriggerUpdateMutation,
    TriggerUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<TriggerUpdateMutation, TriggerUpdateMutationVariables>(
    TriggerUpdateDocument,
    options
  )
}
export type TriggerUpdateMutationHookResult = ReturnType<typeof useTriggerUpdateMutation>
export type TriggerUpdateMutationResult = ApolloReactCommon.MutationResult<TriggerUpdateMutation>
export type TriggerUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  TriggerUpdateMutation,
  TriggerUpdateMutationVariables
>
export const TrackingScriptDocument = gql`
  query TrackingScript {
    trackingScript {
      id
      pk
      domain
      isVerified
      excludedPaths
      allowedCountryCodes
      minimumSessionTimeSec
      identificationMode
      dailyLimit
      createdAt
      updatedAt
    }
  }
`

/**
 * __useTrackingScriptQuery__
 *
 * To run a query within a React component, call `useTrackingScriptQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrackingScriptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrackingScriptQuery({
 *   variables: {
 *   },
 * });
 */
export function useTrackingScriptQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<TrackingScriptQuery, TrackingScriptQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<TrackingScriptQuery, TrackingScriptQueryVariables>(
    TrackingScriptDocument,
    options
  )
}
export function useTrackingScriptLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    TrackingScriptQuery,
    TrackingScriptQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<TrackingScriptQuery, TrackingScriptQueryVariables>(
    TrackingScriptDocument,
    options
  )
}
export function useTrackingScriptSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<TrackingScriptQuery, TrackingScriptQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<TrackingScriptQuery, TrackingScriptQueryVariables>(
    TrackingScriptDocument,
    options
  )
}
export type TrackingScriptQueryHookResult = ReturnType<typeof useTrackingScriptQuery>
export type TrackingScriptLazyQueryHookResult = ReturnType<typeof useTrackingScriptLazyQuery>
export type TrackingScriptSuspenseQueryHookResult = ReturnType<
  typeof useTrackingScriptSuspenseQuery
>
export type TrackingScriptQueryResult = ApolloReactCommon.QueryResult<
  TrackingScriptQuery,
  TrackingScriptQueryVariables
>
export const TrackingScriptUpdateDocument = gql`
  mutation TrackingScriptUpdate($input: TrackingScriptUpdateInput!) {
    trackingScriptUpdate(input: $input) {
      id
      domain
      isVerified
      excludedPaths
      allowedCountryCodes
      minimumSessionTimeSec
      identificationMode
      dailyLimit
      createdAt
      updatedAt
    }
  }
`
export type TrackingScriptUpdateMutationFn = ApolloReactCommon.MutationFunction<
  TrackingScriptUpdateMutation,
  TrackingScriptUpdateMutationVariables
>

/**
 * __useTrackingScriptUpdateMutation__
 *
 * To run a mutation, you first call `useTrackingScriptUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrackingScriptUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trackingScriptUpdateMutation, { data, loading, error }] = useTrackingScriptUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTrackingScriptUpdateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    TrackingScriptUpdateMutation,
    TrackingScriptUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    TrackingScriptUpdateMutation,
    TrackingScriptUpdateMutationVariables
  >(TrackingScriptUpdateDocument, options)
}
export type TrackingScriptUpdateMutationHookResult = ReturnType<
  typeof useTrackingScriptUpdateMutation
>
export type TrackingScriptUpdateMutationResult =
  ApolloReactCommon.MutationResult<TrackingScriptUpdateMutation>
export type TrackingScriptUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  TrackingScriptUpdateMutation,
  TrackingScriptUpdateMutationVariables
>
export const TrackingScriptDomainUpdateDocument = gql`
  mutation TrackingScriptDomainUpdate($input: TrackingScriptDomainUpdateInput!) {
    trackingScriptDomainUpdate(input: $input) {
      id
      pk
      domain
      isVerified
      excludedPaths
      allowedCountryCodes
      minimumSessionTimeSec
      identificationMode
      dailyLimit
      createdAt
      updatedAt
    }
  }
`
export type TrackingScriptDomainUpdateMutationFn = ApolloReactCommon.MutationFunction<
  TrackingScriptDomainUpdateMutation,
  TrackingScriptDomainUpdateMutationVariables
>

/**
 * __useTrackingScriptDomainUpdateMutation__
 *
 * To run a mutation, you first call `useTrackingScriptDomainUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrackingScriptDomainUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trackingScriptDomainUpdateMutation, { data, loading, error }] = useTrackingScriptDomainUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTrackingScriptDomainUpdateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    TrackingScriptDomainUpdateMutation,
    TrackingScriptDomainUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    TrackingScriptDomainUpdateMutation,
    TrackingScriptDomainUpdateMutationVariables
  >(TrackingScriptDomainUpdateDocument, options)
}
export type TrackingScriptDomainUpdateMutationHookResult = ReturnType<
  typeof useTrackingScriptDomainUpdateMutation
>
export type TrackingScriptDomainUpdateMutationResult =
  ApolloReactCommon.MutationResult<TrackingScriptDomainUpdateMutation>
export type TrackingScriptDomainUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  TrackingScriptDomainUpdateMutation,
  TrackingScriptDomainUpdateMutationVariables
>
