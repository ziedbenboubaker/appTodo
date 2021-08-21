import React, { useCallback } from "react";

interface ListItemProps {
  id: string;
  name: string;
  optimistic?: boolean;
  onDelete?: (id: string) => void;
}

export function ListItem({ id, name, optimistic, onDelete }: ListItemProps) {
  const onClick = useCallback(() => {
    onDelete?.(id);
  }, [onDelete, id]);

  return (
    <div className="listItem">
      <p>{name}</p>
      <button disabled={optimistic} onClick={onClick}>
        {optimistic ? "creating..." : "Delete"}
      </button>
    </div>
  );
}
