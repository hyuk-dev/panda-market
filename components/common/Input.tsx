interface InputProps {
  placeholder: string;
  errorMessage?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isError?: boolean;
  value?: string;
}

export default function Input({
  placeholder,
  errorMessage,
  onChange,
  onKeyDown,
  isError,
  value,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
        className={`bg-[#F3F4F6]  h-[56px] rounded-xl p-4 focus:outline-none focus:bg-[#e8e9eb] ${
          isError && "border border-[#F74747]"
        }`}
      ></input>
      {isError && <div className="font-semibold text-[15px] text-[#F74747]">{errorMessage}</div>}
    </div>
  );
}
