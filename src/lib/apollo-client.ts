"use client";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { getAuth } from "firebase/auth";

const isDevelopment = process.env.NODE_ENV === "development";

const getGraphQLUrl = () => {
  if (typeof window !== "undefined") {
    if (isDevelopment) {
      return (
        process.env.NEXT_PUBLIC_GRAPHQL_URL ||
        "http://localhost:3001/api/graphql"
      );
    }
    return "/api/graphql";
  }
  return (
    process.env.INTERNAL_GRAPHQL_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    "http://localhost:3001/api/graphql"
  );
};

const GRAPHQL_URL = getGraphQLUrl();
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "";

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
});

function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

const authLink = setContext(async (_, { headers }) => {
  let token: string | null = null;

  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      token = await user.getIdToken();
    }
  } catch {
    // Firebase not initialized yet
  }

  const sessionId = getSessionId();

  return {
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
      ...(sessionId && { "x-session-id": sessionId }),
      ...(TENANT_ID && { "x-tenant-id": TENANT_ID }),
    },
  };
});

const errorLink = onError(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  } else {
    console.error(`[Network error]: ${error}`);
  }
});

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            keyArgs: ["filters"],
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
      Product: { keyFields: ["id"] },
      Category: { keyFields: ["id"] },
      Cart: { keyFields: ["id"], merge: true },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

export default apolloClient;
