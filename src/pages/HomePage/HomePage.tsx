import React, { FormEvent, useCallback, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";

import {
  CREATE_ITEM_MUTATION,
  GET_LIST_QUERY,
  DELETE_ITEM_MUTATION,
} from "../../gql";

export function HomePage() {
  const [listName, setListName] = useState("");
  const [itemName, setItemName] = useState("");

  const [getList, { loading, data }] = useLazyQuery(GET_LIST_QUERY);

  const [createItem] = useMutation(CREATE_ITEM_MUTATION, {
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
    (e: FormEvent) => {
      e.preventDefault();
      const options = { variables: { name: listName } };

      getList(options);
    },
    [getList, listName]
  );

  const onItemFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const options = {
        variables: { input: { listId: data?.getList?.id, name: itemName } },
      };

      createItem(options);
      setItemName("");
    },
    [data, createItem, itemName]
  );

  const onListNameChange = useCallback((event) => {
    setListName(event.target.value);
  }, []);

  const onItemNameChange = useCallback((event) => {
    setItemName(event.target.value);
  }, []);

  return (
    <div>
      <form onSubmit={onListFormSubmit}>
        <input
          required
          value={listName}
          onChange={onListNameChange}
          placeholder="please enter a name..."
        />
        <button type="submit">Click me</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/*list items*/}
          {data?.getList?.items.map((item: any) => (
            <div key={item.id}>
              <p>
                {item.name}{" "}
                {typeof item.id === "number" && <span>creating...</span>}
              </p>
              <button
                disabled={typeof item.id === "number"}
                onClick={() => {
                  deleteItem({ variables: { id: item.id } });
                }}
              >
                Delete
              </button>
            </div>
          ))}

          {/*New item form*/}
          {data?.getList && (
            <form onSubmit={onItemFormSubmit}>
              <input value={itemName} required onChange={onItemNameChange} />
              <button type="submit">Add</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
