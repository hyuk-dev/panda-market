import Link from "next/link";

interface ButtonProps {
  name: string;
  disabled?: boolean;
  click?: () => void;
  width?: string;
  height?: string;
  borderRadius?: number;
}

export default function Button ({name, disabled, click, width, height, borderRadius} : ButtonProps) {

  return(
        <button
        style={{ width, height, borderRadius}}
    className={`px-[23px] py-[12px] rounded-lg text-white ${disabled ? "bg-gray-400 cursor-not-allowed text-[16px] font-semibold" : "bg-[#3692FF] hover:bg-[#366cff]"} whitespace-nowrap flex items-center justify-center`}
    disabled={disabled} // disabled 속성 적용
    onClick={click}
    >
      {name}
    </button>
  )
}