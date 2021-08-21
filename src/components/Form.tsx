import React, { FormEvent, useCallback, useState } from "react";

interface FormProps {
  hidden?: boolean;
  buttonTitle: string;
  placeholder?: string;
  resetInputFieldOnSubmit?: boolean;
  onSubmit?: (name: string) => void;
}

export function Form({
  hidden,
  buttonTitle,
  placeholder,
  resetInputFieldOnSubmit,
  onSubmit,
}: FormProps) {
  const [itemName, setItemName] = useState("");

  const onItemNameChange = useCallback((event) => {
    setItemName(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      onSubmit?.(itemName);
      resetInputFieldOnSubmit && setItemName("");
    },
    [resetInputFieldOnSubmit, onSubmit, itemName]
  );

  if (hidden) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={itemName}
        required
        onChange={onItemNameChange}
        placeholder={placeholder}
      />
      <button type="submit">{buttonTitle}</button>
    </form>
  );
}
