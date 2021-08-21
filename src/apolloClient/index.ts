import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const cache = new InMemoryCache({
  typePolicies: {
    List: {
      fields: {
        items: {
          merge: false,
        },
      },
    },
  },
});

const authLink = setContext(() => ({}));

const httpLink = new HttpLink({ uri: "http://localhost:5000/graphql" });

const link = from([authLink, httpLink]);

export default new ApolloClient({ link, cache });
