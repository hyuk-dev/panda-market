import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

interface MoreMenuProps {
  onUpdate: () => void;
  onDelete: () => void;
  isMenuBar: boolean;
  setIsMenuBar: Dispatch<SetStateAction<boolean>>;
}

export default function MoreMenu({
  onUpdate,
  onDelete,
  isMenuBar,
  setIsMenuBar,
}: MoreMenuProps) {
  function handleMenu() {
    setIsMenuBar((prev) => !prev);
  }
  return (
    <div className="relative">
      <div
        className="relative w-[24px] h-[24px] cursor-pointer"
        onClick={handleMenu}
      >
        <Image src="/imgs/ic_kebab.png" fill alt="글 관리 메뉴" />
      </div>
      {isMenuBar && (
        <div className="absolute right-2">
          <div
            className="bg-white border-x border-t border-[#D1D5DB] pt-[16px] pb-[12px] md:w-[139px] w-[102px] rounded-tl-lg rounded-tr-lg flex justify-center text-[#6B7280] z-50 cursor-pointer hover:bg-slate-50"
            onClick={onUpdate}
          >
            수정하기
          </div>
          <div
            className="bg-white border-x border-b border-[#D1D5DB] pt-[16px] pb-[12px] md:w-[139px] w-[102px] rounded-bl-lg rounded-br-lg flex justify-center text-[#6B7280] z-50 cursor-pointer hover:bg-slate-50"
            onClick={onDelete}
          >
            삭제하기
          </div>
        </div>
      )}
    </div>
  );
}
