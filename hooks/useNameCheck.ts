import { useState } from "react";

interface Name {
  name: string;
  nameCheck: string;
}

interface UseNameCheckReturn {
  name: string;
  nameCheck: string;
  handleNameInputChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useNameCheck (nameInitial : string) : UseNameCheckReturn {
    const [name, setName] = useState<Name['name']>(nameInitial);
    const [nameCheck, setNameCheck] = useState<Name['nameCheck']>('first');

    function handleNameInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setName(e.target.value);
        handleNameCheck(e.target.value);
      }

      function handleNameCheck(nameInput : string): void {
        if (nameInput.length <= 10 && nameInput.length >= 1) setNameCheck('checked');
        else setNameCheck('notChecked');
      }

    return {name, nameCheck, handleNameInputChange};
}