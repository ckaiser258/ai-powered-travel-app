import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

// Configure Apollo client
const httpLink = createHttpLink({
  uri: "http://localhost:3000/api",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
