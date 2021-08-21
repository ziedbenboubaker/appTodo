import { gql } from "@apollo/client";

export const GET_ITEMS_QUERY = gql`
  query getItems($listId: ID!) {
    getItems(listId: $listId) {
      id
      name
      listId
    }
  }
`;
