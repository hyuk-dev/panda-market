import { useState , useEffect } from "react";

interface Tag {
  tag: string[];
  tagCheck: string;
}

interface UseTagCheckReturn {
  tag: string[];
  setTag: React.Dispatch<React.SetStateAction<string[]>>;
  tagCheck: string;
  handleTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useTagCheck (tagInitial : string[] = []) : UseTagCheckReturn  {
    type TagInput = string;
    const [tag, setTag] = useState<Tag['tag']>([...tagInitial]);
    const [tagCheck, setTagCheck] = useState<Tag['tagCheck']>('first');
    const [tagInput, setTagInput] = useState<TagInput>('');

  function tagInputCheckFunc(): void{
    if(typeof tagInput === 'string'){
      if(tagInput.length > 5) setTagCheck('notChecked');
      else setTagCheck('checked');
    }
  }

  useEffect(()=>{
    tagInputCheckFunc();
},[tagInput])


function handleTagInputKeyDown(e : React.KeyboardEvent<HTMLInputElement>):void {
    const target = e.target as HTMLInputElement;
    if (target.value && e.key === 'Enter') {
        if(tagCheck === "checked"){
            setTagCheck('first');
            if(typeof tag === 'object'){
              if(!(tag.find((element)=>element === target.value))) setTag([...tag, target.value]);
              target.value = '';
            }
        }
    }
  }

  
  function handleTagChange (e: React.ChangeEvent<HTMLInputElement>) {
    setTagInput(e.target.value);
  }

  return {tag,setTag,tagCheck,handleTagInputKeyDown,handleTagChange};

}