import { gql } from "@apollo/client";

export const GET_LIST_QUERY = gql`
  query getList($name: String!) {
    getList(name: $name) {
      id
      name
      items {
        id
        name
        listId
      }
    }
  }
`;
