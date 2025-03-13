import { ReactNode } from "react";

interface ModalProps {
  isShow: boolean;
  children: ReactNode;
  width?: string;
}

export default function Modal({ isShow, children, width }: ModalProps) {
  return (
    isShow && (
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div
          className={`relative w-[100%] bg-white z-50 md:py-[60px] py-[43px] rounded-lg flex justify-center m-4`}
          style={{ maxWidth: width }}
        >
          {children}
        </div>
      </div>
    )
  );
}
