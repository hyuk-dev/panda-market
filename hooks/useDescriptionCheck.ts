import { useState, ChangeEventHandler, FocusEventHandler } from 'react';

interface Description {
  description: string;
  descriptionCheck: string;
}

interface UseDescriptionReturn {
  description: string;
  descriptionCheck: string;
  handleDescriptionInputChange: ChangeEventHandler<HTMLTextAreaElement>;
}

export function useDescriptionCheck(descriptionInitial : string = ""): UseDescriptionReturn {
  const [description, setDescription] = useState<Description['description']>(descriptionInitial);
  const [descriptionCheck, setDescriptionCheck] = useState<Description['descriptionCheck']>('first');

  function handleDescriptionInputChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void {
    setDescription(e.target.value);
    handleDescriptionCheck(e.target.value);
  }

  function handleDescriptionCheck(descriptionInput : string): void {
    if (descriptionInput.length >= 10 && descriptionInput.length  <= 100)
      setDescriptionCheck('checked');
    else setDescriptionCheck('notChecked');
  }

  return {
    description,
    descriptionCheck,
    handleDescriptionInputChange,
  };
}
