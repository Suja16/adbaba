import { StrictMode } from "react";
import App from "./App";
import ReactDOM from "react-dom/client";

import { createHttpLink } from "@apollo/client";

import { InMemoryCache, ApolloClient, ApolloProvider } from "@apollo/client";
import StyleThemeProvider from "./themesystem";

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyleThemeProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </StyleThemeProvider>
  </StrictMode>
);
