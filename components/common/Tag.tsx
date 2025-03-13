import Image from "next/image";

interface Props {
  children: string;
  setTag: React.Dispatch<React.SetStateAction<string[]>>;
  tag: string[];
}
const TagElement : React.FC<Props> = ({ children, setTag, tag }) => {
    function handleDeleteClick (){
        setTag(tag.filter((element: string)=>element !== children));
    }
  return (
    <div className="flex gap-1 bg-[#F3F4F6] rounded-3xl h-[36px] px-4 justify-between items-center">
      <div>#{children}</div>
      <div className="relative h-[24px] w-[22px] cursor-pointer">
        <Image src="/imgs/ic_X.png" fill onClick={handleDeleteClick} alt="삭제"/>
      </div>
    </div>
  );
}

export default TagElement;