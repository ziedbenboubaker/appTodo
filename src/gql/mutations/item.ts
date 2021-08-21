import { gql } from "@apollo/client";

export const CREATE_ITEM_MUTATION = gql`
  mutation createItem($input: ItemInput!) {
    createItem(input: $input) {
      id
      name
      listId
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation deleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
      name
      listId
    }
  }
`;
