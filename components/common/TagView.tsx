interface Props {
  children: string;
}
const TagView : React.FC<Props> = ({ children }) => {
  return (
    <div className="flex gap-1 bg-[#F3F4F6] rounded-3xl h-[36px] px-4 justify-between items-center">
      <div>#{children}</div>
    </div>
  );
}

export default TagView;