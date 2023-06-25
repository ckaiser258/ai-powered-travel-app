import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://aitravelapp.vercel.app";

// Configure Apollo client
const httpLink = createHttpLink({
  uri: `${baseUrl}/api`,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
