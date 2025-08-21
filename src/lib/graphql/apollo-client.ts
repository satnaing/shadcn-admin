import {
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  ApolloLink,
  type TypePolicies,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const createHttpMainApiLink = (gqlEndpoint?: string) =>
  new HttpLink({
    uri: gqlEndpoint,
  });

const getReqHeaders = async (
  getToken: () => Promise<string | undefined>,
  getOrg?: () => string,
) => {
  const token = await getToken();
  const fakeOrg = getOrg?.();

  const selectedOrgId = localStorage.getItem('swan.selected_org_id');

  return {
    ...(fakeOrg && { 'x-override-org-id': fakeOrg }),
    ...(selectedOrgId && { 'x-selected-org-id': selectedOrgId }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const createTokenLink = (getToken: () => Promise<string | undefined>, getOrg?: () => string) =>
  setContext(async () => {
    return {
      headers: await getReqHeaders(getToken, getOrg),
    };
  });

const createErrorHandlingLink = () =>
  onError(({ graphQLErrors }) => {
    const error = graphQLErrors?.[0];

    if (
      error?.extensions?.code == 'UNAUTHENTICATED' &&
      ['app', 'agent'].some((s) => location.host.includes(s)) &&
      !location.pathname.includes('login')
    ) {
      location.reload(); // until this can be handled otherwise?
      return;
    }
  });

const createMiddlewareLink = (gqlEndpoint?: string) =>
  new ApolloLink((operation, forward) => {
    if (operation.query.definitions) {
      const operationDefinition: any = operation.query.definitions.find(
        (definition) => definition.kind === 'OperationDefinition',
      );

      if (operationDefinition?.name) {
        const operationName = operationDefinition?.name.value;
        operation.setContext({
          uri: `${gqlEndpoint}?${operationName}`,
        });
      }
    }
    return forward(operation);
  });

const createApolloClient = (args: {
  gqlEndpoint?: string;
  getCustomOrg?: () => string;
  getAuthToken: () => Promise<string | undefined>;
  typePolicies?: TypePolicies;
}) => {
  const cache = new InMemoryCache({ typePolicies: args.typePolicies });

  const withTokenLink = createTokenLink(args.getAuthToken, args.getCustomOrg);
  const errorHandlingLink = createErrorHandlingLink();
  const httpMainApiLink = createHttpMainApiLink(args.gqlEndpoint);
  const middlewareLink = createMiddlewareLink(args.gqlEndpoint);

  return new ApolloClient({
    link: from([withTokenLink, errorHandlingLink, middlewareLink, httpMainApiLink]),
    cache,
  });
};

export { createApolloClient };
