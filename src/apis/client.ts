import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
const httpLink = createHttpLink({
  uri: `http://${window.location.hostname}:7000/graphql`,
});
export const apolloClient = new ApolloClient({
  uri: `http://${window.location.hostname}:7000/graphql`,
  link: httpLink,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  credentials: 'include',
});
