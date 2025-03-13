import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  totalCount: number;
}

const SelectPage: React.FC<Props> = ({
  page,
  setPage,
  pageSize,
  totalCount,
}) => {
  const [totalPages, setTotalPages] = useState<number>(1);
  const [startPage, setStartPage] = useState<number>(page);
  const [endPage, setEndPage] = useState<number>(page + 4);

  useEffect(() => {
    setPage(1);
    setStartPage(1);
    setEndPage(page + 4);
  }, [pageSize]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  function handleMovePage(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    setPage(Number(target.innerText));
  }

  function handleRightClick(e: React.MouseEvent) {
    setStartPage(startPage + 5);
    setEndPage(endPage + 5);
  }

  function handleLeftClick(e: React.MouseEvent) {
    setStartPage(startPage - 5);
    setEndPage(endPage - 5);
  }

  return (
    <div className="flex gap-2">
      <button
        className={`border flex justify-center items-center rounded-full w-[40px] h-[40px] font-semibold text-[#6B7280] ${startPage <= 1 ? "opacity-50" : "cursor-pointer"}`}
        onClick={handleLeftClick}
        disabled={startPage <= 1}
      >
        <div className="relative w-[16px] h-[16px]">
          <Image
            src="/imgs/arrow_left.png"
            fill
            alt="왼쪽"
            objectFit="cover"
          />
        </div>
        {/* <img src={leftImg} /> */}
      </button>

      {[...Array(5)].map((_, key) => {
        key = key + startPage - 1;
        if (key + 1 <= totalPages)
          return (
            <div
              className={
                key + 1 === page
                  ? "bg-[#2F80ED] cursor-pointer flex justify-center items-center rounded-full w-[40px] h-[40px] font-semibold text-white"
                  : "cursor-pointer border flex justify-center items-center rounded-full w-[40px] h-[40px] font-semibold text-[#6B7280]"
              }
              key={key + 1}
              onClick={handleMovePage}
            >
              {key + 1}
            </div>
          );
      })}

<button
        className={`border flex justify-center items-center rounded-full w-[40px] h-[40px] font-semibold text-[#6B7280] ${startPage + 5 >= totalPages ? "opacity-50" : "cursor-pointer"}`}
        onClick={handleRightClick}
        disabled={startPage + 5 >= totalPages}
      >
        <div className="relative w-[16px] h-[16px]">
          <Image
            src="/imgs/arrow_right.png"
            fill
            alt="오른쪽"
            objectFit="cover"
          />
        </div>
        {/* <img src={leftImg} /> */}
      </button>
    </div>
  );
};

export default SelectPage;
