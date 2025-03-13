import Image from "next/image";
import { useState } from "react";

interface AuthInputProps {
  placeholder: string;
  errorMessage?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isError?: boolean;
}

export default function PasswordInput({
  placeholder,
  errorMessage,
  onChange,
  isError,
}: AuthInputProps) {
  const [isShow, setIsShow] = useState(false);
  const handleShow = () => {
    setIsShow((prev) => !prev);
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col relative">
        <input
        type={isShow?"":"password"}
          placeholder={placeholder}
          onChange={onChange}
          className={`bg-[#F3F4F6]  h-[56px] rounded-xl p-4 focus:outline-none focus:bg-[#e8e9eb] ${
            isError && "border border-[#F74747]"
          }`}
        />
        <Image
        className="absolute right-5 top-5 cursor-pointer"
          src={isShow? "/imgs/eye_open.png" : "/imgs/eye_close.png"}
          width={20}
          height={14}
          alt="보기/숨기기"
          onClick={handleShow}
        />
      </div>
      {isError && (
        <div className="font-semibold text-[15px] text-[#F74747]">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
