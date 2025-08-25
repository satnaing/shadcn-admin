import type * as Types from '../../../../graphql/global/types.generated';

import { gql } from '@apollo/client';
import type * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
const defaultOptions = {} as const;
export type TargetMarketFieldsFragment = { __typename?: 'TargetMarket', id: string, color?: string | null, customerType?: Types.CustomerType | null, notificationChannel?: any | null, inboxChannel?: any | null, hqLocations: any, maxEmployees?: number | null, minEmployees?: number | null, minRevenue?: any | null, maxRevenue?: any | null, industry?: string | null, name?: string | null, extraRequirements?: string | null, type: Types.TargetMarketType, size: number, createdAt: any, questions?: Array<{ __typename?: 'Question', id: string }> | null, personas?: Array<{ __typename?: 'Persona', id: string }> | null };

export type PersonaFieldsFragment = { __typename?: 'Persona', id: string, name: string, valueProp?: string | null, description?: string | null, maxContacts: number, createdAt: any, targetMarkets: Array<{ __typename?: 'PersonaTargetMarket', id: string, targetMarketId: string }> };

export type TargetMarketsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TargetMarketsQuery = { __typename?: 'Query', targetMarkets: Array<{ __typename?: 'TargetMarket', id: string, color?: string | null, customerType?: Types.CustomerType | null, notificationChannel?: any | null, inboxChannel?: any | null, hqLocations: any, maxEmployees?: number | null, minEmployees?: number | null, minRevenue?: any | null, maxRevenue?: any | null, industry?: string | null, name?: string | null, extraRequirements?: string | null, type: Types.TargetMarketType, size: number, createdAt: any, questions?: Array<{ __typename?: 'Question', id: string }> | null, personas?: Array<{ __typename?: 'Persona', id: string }> | null }> };

export type TargetMarketQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type TargetMarketQuery = { __typename?: 'Query', targetMarket?: { __typename?: 'TargetMarket', id: string, color?: string | null, customerType?: Types.CustomerType | null, notificationChannel?: any | null, inboxChannel?: any | null, hqLocations: any, maxEmployees?: number | null, minEmployees?: number | null, minRevenue?: any | null, maxRevenue?: any | null, industry?: string | null, name?: string | null, extraRequirements?: string | null, type: Types.TargetMarketType, size: number, createdAt: any, personas?: Array<{ __typename?: 'Persona', id: string, name: string, valueProp?: string | null, description?: string | null, maxContacts: number, createdAt: any, targetMarkets: Array<{ __typename?: 'PersonaTargetMarket', id: string, targetMarketId: string }> }> | null, questions?: Array<{ __typename?: 'Question', id: string }> | null } | null };

export type TargetMarketUpsertMutationVariables = Types.Exact<{
  input: Types.TargetMarketUpsertInput;
}>;


export type TargetMarketUpsertMutation = { __typename?: 'Mutation', targetMarketUpsert: { __typename?: 'TargetMarket', id: string, color?: string | null, customerType?: Types.CustomerType | null, notificationChannel?: any | null, inboxChannel?: any | null, hqLocations: any, maxEmployees?: number | null, minEmployees?: number | null, minRevenue?: any | null, maxRevenue?: any | null, industry?: string | null, name?: string | null, extraRequirements?: string | null, type: Types.TargetMarketType, size: number, createdAt: any, questions?: Array<{ __typename?: 'Question', id: string }> | null, personas?: Array<{ __typename?: 'Persona', id: string }> | null } };

export type TargetMarketDeleteMutationVariables = Types.Exact<{
  input: Types.TargetMarketDeleteInput;
}>;


export type TargetMarketDeleteMutation = { __typename?: 'Mutation', targetMarketDelete: { __typename?: 'GenericResolverResponse', success: boolean } };

export type PersonasQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.PersonaFilters>;
}>;


export type PersonasQuery = { __typename?: 'Query', personas: Array<{ __typename?: 'Persona', id: string, name: string, valueProp?: string | null, description?: string | null, maxContacts: number, createdAt: any, targetMarkets: Array<{ __typename?: 'PersonaTargetMarket', id: string, targetMarketId: string }> }> };

export type PersonaUpsertMutationVariables = Types.Exact<{
  input: Types.PersonaUpsertInput;
}>;


export type PersonaUpsertMutation = { __typename?: 'Mutation', personaUpsert: { __typename?: 'Persona', id: string, name: string, valueProp?: string | null, description?: string | null, maxContacts: number, createdAt: any, targetMarkets: Array<{ __typename?: 'PersonaTargetMarket', id: string, targetMarketId: string }> } };

export type PersonasDeleteMutationVariables = Types.Exact<{
  input: Types.BatchModelDeleteInput;
}>;


export type PersonasDeleteMutation = { __typename?: 'Mutation', personasDelete: { __typename?: 'GenericResolverResponse', success: boolean } };

export const TargetMarketFieldsFragmentDoc = gql`
    fragment targetMarketFields on TargetMarket {
  id
  questions {
    id
  }
  personas {
    id
  }
  color
  customerType
  notificationChannel
  inboxChannel
  hqLocations
  maxEmployees
  minEmployees
  minRevenue
  maxRevenue
  industry
  name
  extraRequirements
  type
  size
  createdAt
}
    `;
export const PersonaFieldsFragmentDoc = gql`
    fragment personaFields on Persona {
  id
  name
  valueProp
  targetMarkets {
    id
    targetMarketId
  }
  description
  maxContacts
  createdAt
}
    `;
export const TargetMarketsDocument = gql`
    query TargetMarkets {
  targetMarkets {
    ...targetMarketFields
  }
}
    ${TargetMarketFieldsFragmentDoc}`;

/**
 * __useTargetMarketsQuery__
 *
 * To run a query within a React component, call `useTargetMarketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTargetMarketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTargetMarketsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTargetMarketsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TargetMarketsQuery, TargetMarketsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TargetMarketsQuery, TargetMarketsQueryVariables>(TargetMarketsDocument, options);
      }
export function useTargetMarketsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TargetMarketsQuery, TargetMarketsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TargetMarketsQuery, TargetMarketsQueryVariables>(TargetMarketsDocument, options);
        }
export function useTargetMarketsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<TargetMarketsQuery, TargetMarketsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<TargetMarketsQuery, TargetMarketsQueryVariables>(TargetMarketsDocument, options);
        }
export type TargetMarketsQueryHookResult = ReturnType<typeof useTargetMarketsQuery>;
export type TargetMarketsLazyQueryHookResult = ReturnType<typeof useTargetMarketsLazyQuery>;
export type TargetMarketsSuspenseQueryHookResult = ReturnType<typeof useTargetMarketsSuspenseQuery>;
export type TargetMarketsQueryResult = ApolloReactCommon.QueryResult<TargetMarketsQuery, TargetMarketsQueryVariables>;
export const TargetMarketDocument = gql`
    query TargetMarket($id: String!) {
  targetMarket(id: $id) {
    ...targetMarketFields
    personas {
      ...personaFields
    }
  }
}
    ${TargetMarketFieldsFragmentDoc}
${PersonaFieldsFragmentDoc}`;

/**
 * __useTargetMarketQuery__
 *
 * To run a query within a React component, call `useTargetMarketQuery` and pass it any options that fit your needs.
 * When your component renders, `useTargetMarketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTargetMarketQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTargetMarketQuery(baseOptions: ApolloReactHooks.QueryHookOptions<TargetMarketQuery, TargetMarketQueryVariables> & ({ variables: TargetMarketQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TargetMarketQuery, TargetMarketQueryVariables>(TargetMarketDocument, options);
      }
export function useTargetMarketLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TargetMarketQuery, TargetMarketQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TargetMarketQuery, TargetMarketQueryVariables>(TargetMarketDocument, options);
        }
export function useTargetMarketSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<TargetMarketQuery, TargetMarketQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<TargetMarketQuery, TargetMarketQueryVariables>(TargetMarketDocument, options);
        }
export type TargetMarketQueryHookResult = ReturnType<typeof useTargetMarketQuery>;
export type TargetMarketLazyQueryHookResult = ReturnType<typeof useTargetMarketLazyQuery>;
export type TargetMarketSuspenseQueryHookResult = ReturnType<typeof useTargetMarketSuspenseQuery>;
export type TargetMarketQueryResult = ApolloReactCommon.QueryResult<TargetMarketQuery, TargetMarketQueryVariables>;
export const TargetMarketUpsertDocument = gql`
    mutation TargetMarketUpsert($input: TargetMarketUpsertInput!) {
  targetMarketUpsert(input: $input) {
    ...targetMarketFields
  }
}
    ${TargetMarketFieldsFragmentDoc}`;
export type TargetMarketUpsertMutationFn = ApolloReactCommon.MutationFunction<TargetMarketUpsertMutation, TargetMarketUpsertMutationVariables>;

/**
 * __useTargetMarketUpsertMutation__
 *
 * To run a mutation, you first call `useTargetMarketUpsertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTargetMarketUpsertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [targetMarketUpsertMutation, { data, loading, error }] = useTargetMarketUpsertMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTargetMarketUpsertMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<TargetMarketUpsertMutation, TargetMarketUpsertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<TargetMarketUpsertMutation, TargetMarketUpsertMutationVariables>(TargetMarketUpsertDocument, options);
      }
export type TargetMarketUpsertMutationHookResult = ReturnType<typeof useTargetMarketUpsertMutation>;
export type TargetMarketUpsertMutationResult = ApolloReactCommon.MutationResult<TargetMarketUpsertMutation>;
export type TargetMarketUpsertMutationOptions = ApolloReactCommon.BaseMutationOptions<TargetMarketUpsertMutation, TargetMarketUpsertMutationVariables>;
export const TargetMarketDeleteDocument = gql`
    mutation TargetMarketDelete($input: TargetMarketDeleteInput!) {
  targetMarketDelete(input: $input) {
    success
  }
}
    `;
export type TargetMarketDeleteMutationFn = ApolloReactCommon.MutationFunction<TargetMarketDeleteMutation, TargetMarketDeleteMutationVariables>;

/**
 * __useTargetMarketDeleteMutation__
 *
 * To run a mutation, you first call `useTargetMarketDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTargetMarketDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [targetMarketDeleteMutation, { data, loading, error }] = useTargetMarketDeleteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTargetMarketDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<TargetMarketDeleteMutation, TargetMarketDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<TargetMarketDeleteMutation, TargetMarketDeleteMutationVariables>(TargetMarketDeleteDocument, options);
      }
export type TargetMarketDeleteMutationHookResult = ReturnType<typeof useTargetMarketDeleteMutation>;
export type TargetMarketDeleteMutationResult = ApolloReactCommon.MutationResult<TargetMarketDeleteMutation>;
export type TargetMarketDeleteMutationOptions = ApolloReactCommon.BaseMutationOptions<TargetMarketDeleteMutation, TargetMarketDeleteMutationVariables>;
export const PersonasDocument = gql`
    query Personas($filter: PersonaFilters) {
  personas(filter: $filter) {
    ...personaFields
  }
}
    ${PersonaFieldsFragmentDoc}`;

/**
 * __usePersonasQuery__
 *
 * To run a query within a React component, call `usePersonasQuery` and pass it any options that fit your needs.
 * When your component renders, `usePersonasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePersonasQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function usePersonasQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<PersonasQuery, PersonasQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PersonasQuery, PersonasQueryVariables>(PersonasDocument, options);
      }
export function usePersonasLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PersonasQuery, PersonasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PersonasQuery, PersonasQueryVariables>(PersonasDocument, options);
        }
export function usePersonasSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<PersonasQuery, PersonasQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<PersonasQuery, PersonasQueryVariables>(PersonasDocument, options);
        }
export type PersonasQueryHookResult = ReturnType<typeof usePersonasQuery>;
export type PersonasLazyQueryHookResult = ReturnType<typeof usePersonasLazyQuery>;
export type PersonasSuspenseQueryHookResult = ReturnType<typeof usePersonasSuspenseQuery>;
export type PersonasQueryResult = ApolloReactCommon.QueryResult<PersonasQuery, PersonasQueryVariables>;
export const PersonaUpsertDocument = gql`
    mutation PersonaUpsert($input: PersonaUpsertInput!) {
  personaUpsert(input: $input) {
    ...personaFields
  }
}
    ${PersonaFieldsFragmentDoc}`;
export type PersonaUpsertMutationFn = ApolloReactCommon.MutationFunction<PersonaUpsertMutation, PersonaUpsertMutationVariables>;

/**
 * __usePersonaUpsertMutation__
 *
 * To run a mutation, you first call `usePersonaUpsertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePersonaUpsertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [personaUpsertMutation, { data, loading, error }] = usePersonaUpsertMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePersonaUpsertMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PersonaUpsertMutation, PersonaUpsertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PersonaUpsertMutation, PersonaUpsertMutationVariables>(PersonaUpsertDocument, options);
      }
export type PersonaUpsertMutationHookResult = ReturnType<typeof usePersonaUpsertMutation>;
export type PersonaUpsertMutationResult = ApolloReactCommon.MutationResult<PersonaUpsertMutation>;
export type PersonaUpsertMutationOptions = ApolloReactCommon.BaseMutationOptions<PersonaUpsertMutation, PersonaUpsertMutationVariables>;
export const PersonasDeleteDocument = gql`
    mutation PersonasDelete($input: BatchModelDeleteInput!) {
  personasDelete(input: $input) {
    success
  }
}
    `;
export type PersonasDeleteMutationFn = ApolloReactCommon.MutationFunction<PersonasDeleteMutation, PersonasDeleteMutationVariables>;

/**
 * __usePersonasDeleteMutation__
 *
 * To run a mutation, you first call `usePersonasDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePersonasDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [personasDeleteMutation, { data, loading, error }] = usePersonasDeleteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePersonasDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PersonasDeleteMutation, PersonasDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PersonasDeleteMutation, PersonasDeleteMutationVariables>(PersonasDeleteDocument, options);
      }
export type PersonasDeleteMutationHookResult = ReturnType<typeof usePersonasDeleteMutation>;
export type PersonasDeleteMutationResult = ApolloReactCommon.MutationResult<PersonasDeleteMutation>;
export type PersonasDeleteMutationOptions = ApolloReactCommon.BaseMutationOptions<PersonasDeleteMutation, PersonasDeleteMutationVariables>;