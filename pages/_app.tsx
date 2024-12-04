import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import "../styles/globals.css";
import { AppProps } from "next/app";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
