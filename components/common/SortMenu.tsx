import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
interface SortMenuProps {
  width: number;
  order: string;
  setOrder: Dispatch<SetStateAction<string>>;
}

export default function SortMenu ({width, order, setOrder} : SortMenuProps) {
  const [isOrderMenu, setIsOrderMenu] = useState(false);
  function handleOrderMenu() {
    setIsOrderMenu((prev) => !prev);
  }

  function handleOrderNew() {
    setOrder("recent");
    setIsOrderMenu(false);
  }

  function handleOrderLike() {
    setOrder("favorite");
    setIsOrderMenu(false);
  }

  return(
    <div className="relative">
    {width < 769 ? (
      <div
        className="border border-[#E5E7EB] w-[50px] h-[50px] rounded-xl flex justify-center items-center cursor-pointer"
        onClick={handleOrderMenu}
      >
        <Image
          src="/imgs/ic_sort.png"
          alt="정렬"
          width={24}
          height={24}
        />
      </div>
    ) : (
      <div
        className="border border-[#E5E7EB] w-[130px] h-[42px] px-[20px] py-[12px] rounded-xl flex justify-between items-center cursor-pointer"
        onClick={handleOrderMenu}
      >
        <div>
          {order === "recent" ? (
            <div>최신순</div>
          ) : (
            <div>좋아요 순</div>
          )}
        </div>
        <div className="relative w-[15.7px] h-[7.42px]">
          <Image src="/imgs/polygon.png" fill alt="화살표" />
        </div>
      </div>
    )}

    {isOrderMenu && (
      <div>
        {width < 769 ? (
          <div>
            <div className="bg-white absolute z-50 w-[104px] top-14 right-0 flex flex-col justify-center items-center">
              <div
                className="flex justify-center border w-[100%] rounded-t-xl p-2 hover:bg-slate-100 cursor-pointer"
                onClick={handleOrderNew}
              >
                최신순
              </div>
              <div
                className="bg-white flex justify-center border-l border-r border-b w-[100%] rounded-b-xl p-2 hover:bg-slate-100 cursor-pointer"
                onClick={handleOrderLike}
              >
                좋아요 순
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute z-50 w-[130px] top-12 flex flex-col justify-center items-center">
              <div
                className="bg-white flex justify-center border w-[100%] rounded-t-xl p-2 hover:bg-slate-100 cursor-pointer"
                onClick={handleOrderNew}
              >
                최신순
              </div>
              <div
                className="bg-white flex justify-center border-l border-r border-b w-[100%] rounded-b-xl p-2 hover:bg-slate-100 cursor-pointer"
                onClick={handleOrderLike}
              >
                좋아요 순
              </div>
            </div>
          </>
        )}
      </div>
    )}
  </div>
  )
}