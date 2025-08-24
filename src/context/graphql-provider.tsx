import { useMemo, type ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useAuth } from '@clerk/clerk-react';
import { createApolloClient } from '../lib/graphql/apollo-client';

// Constants for localStorage keys
const GLOBAL_ORG_KEY = 'swan.global_org_id';
const AUTH_TOKEN_KEY = 'swan.auth_token';

interface GraphQLProviderProps {
  children: ReactNode;
}

export function GraphQLProvider({ children }: GraphQLProviderProps) {
  const { getToken } = useAuth();

  const apolloClient = useMemo(() => {
    // Function to get auth token from Clerk
    const getAuthToken = async () => {
      try {
        // First try to get token from Clerk
        const clerkToken = await getToken();
        if (clerkToken) {
          return clerkToken;
        }
        
        // Fallback to localStorage if needed
        return localStorage.getItem(AUTH_TOKEN_KEY) || '';
      } catch {
        return localStorage.getItem(AUTH_TOKEN_KEY) || '';
      }
    };

    // Function to get custom organization ID
    const getCustomOrg = () => localStorage.getItem(GLOBAL_ORG_KEY) || '';

    // Get GraphQL endpoint from environment variable
    const gqlEndpoint = import.meta.env.VITE_GQL_ENDPOINT || 'http://localhost:4001/graphql';

    return createApolloClient({ 
      getAuthToken, 
      gqlEndpoint, 
      getCustomOrg 
    });
  }, [getToken]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
