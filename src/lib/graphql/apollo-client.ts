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
) => {
  const token = await getToken();

  // Get the selected org ID from localStorage (set by OrgSelector component)
  const selectedOrgId = localStorage.getItem('selectedOrgId');

  return {
    ...(selectedOrgId && { 'x-override-org-id': selectedOrgId }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const createTokenLink = (getToken: () => Promise<string | undefined>) =>
  setContext(async () => {
    return {
      headers: await getReqHeaders(getToken),
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
  getAuthToken: () => Promise<string | undefined>;
  typePolicies?: TypePolicies;
}) => {
  const cache = new InMemoryCache({ typePolicies: args.typePolicies });

  const withTokenLink = createTokenLink(args.getAuthToken);
  const errorHandlingLink = createErrorHandlingLink();
  const httpMainApiLink = createHttpMainApiLink(args.gqlEndpoint);
  const middlewareLink = createMiddlewareLink(args.gqlEndpoint);

  return new ApolloClient({
    link: from([withTokenLink, errorHandlingLink, middlewareLink, httpMainApiLink]),
    cache,
  });
};

export { createApolloClient };
