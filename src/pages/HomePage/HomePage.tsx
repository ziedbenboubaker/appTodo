import React, { useCallback } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";

import {
  CREATE_ITEM_MUTATION,
  GET_LIST_QUERY,
  DELETE_ITEM_MUTATION,
} from "../../gql";
import { Form, ListItem } from "../../components";

export function HomePage() {
  const [getList, { loading, data }] = useLazyQuery(GET_LIST_QUERY);

  const onError = useCallback(() => {
    alert("error");
  }, []);

  const [createItem] = useMutation(CREATE_ITEM_MUTATION, {
    onError,
    optimisticResponse: (vars) => ({
      __typename: "Mutation",
      createItem: {
        id: Date.now(),
        name: vars.input.name,
        listId: vars.input.listId,
      },
    }),
    updateQueries: {
      getList: (previousResult, { mutationResult }) => {
        return {
          getList: {
            ...previousResult.getList,
            items: [
              ...previousResult.getList.items,
              mutationResult.data.createItem,
            ],
          },
        };
      },
    },
  });

  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
    onError,
    optimisticResponse: (vars) => ({
      __typename: "Mutation",
      deleteItem: {
        id: vars.id,
        name: "",
        listId: "",
      },
    }),
    updateQueries: {
      getList: (previousResult, { mutationResult }) => {
        const items = previousResult?.getList?.items?.filter(
          (item: any) => item.id !== mutationResult.data.deleteItem.id
        );

        return { getList: { ...previousResult.getList, items } };
      },
    },
  });

  const onListFormSubmit = useCallback(
    (name: string) => {
      const options = { variables: { name } };

      getList(options);
    },
    [getList]
  );

  const onItemFormSubmit = useCallback(
    (name: string) => {
      const options = {
        variables: { input: { listId: data?.getList?.id, name } },
      };

      createItem(options);
    },
    [data, createItem]
  );

  const onDelete = useCallback(
    (id: string) => {
      deleteItem({ variables: { id } });
    },
    [deleteItem]
  );

  return (
    <div>
      <Form
        buttonTitle="Fetch list"
        placeholder="Enter list name..."
        onSubmit={onListFormSubmit}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {data?.getList?.items.map((item: any) => (
            <ListItem
              id={item.id}
              key={item.id}
              name={item.name}
              optimistic={typeof item.id === "number"}
              onDelete={onDelete}
            />
          ))}

          <Form
            buttonTitle="Create item"
            placeholder="Enter item name..."
            hidden={!data?.getList}
            onSubmit={onItemFormSubmit}
            resetInputFieldOnSubmit
          />
        </>
      )}
    </div>
  );
}
