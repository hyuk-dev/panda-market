import { ChangeEvent } from "react";

interface InputAreaProps {
  placeholder: string;
  errorMessage?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isError?: boolean;
  value?: string;
}

export default function InputArea({
  placeholder,
  errorMessage,
  onChange,
  isError,
  value,
}: InputAreaProps) {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        placeholder={placeholder}
        onChange={onChange}
        style={{ resize: 'none' }}
        value={value}
        className={`bg-[#F3F4F6]  h-[56px] rounded-xl p-4 focus:outline-none focus:bg-[#e8e9eb] min-h-[282px] ${
          isError && "border border-[#F74747]"
        }`}
      ></textarea>
      {isError && <div className="font-semibold text-[15px] text-[#F74747]">{errorMessage}</div>}
    </div>
  );
}
