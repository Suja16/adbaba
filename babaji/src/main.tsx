import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";

import { createHttpLink } from "@apollo/client";

import { InMemoryCache, ApolloClient, ApolloProvider } from "@apollo/client";

function makeClient() {
  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL,
    headers: {
      "X-Hasura-Admin-Secret": import.meta.env.VITE_HASURA_GRAPHQL_ADMIN_SECRET,
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "network-only",
      },
      mutate: {
        fetchPolicy: "network-only",
      },
      query: {
        fetchPolicy: "network-only",
      },
    },
  });
}

const client = makeClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ThemeProvider>
  </StrictMode>
);
