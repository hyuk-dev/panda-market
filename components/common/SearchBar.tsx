interface SearchBarProps {
  handleSearch : (e:React.ChangeEvent<HTMLInputElement>) => void
  width?: string;
}
export default function SearchBar ({ handleSearch, width } : SearchBarProps) {
  return (
    <input
              className={`focus:outline-[#3692FF] bg-[#F3F4F6] py-[9px] pr-[20px] pl-[40px] w-full rounded-xl text-[16px] w-[${width}]`}
              style={{
                backgroundImage: "url('/imgs/ic_search.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left 10px center",
                backgroundSize: "20px 20px",
                width: `${width}`
              }}
              placeholder="검색할 상품을 입력해주세요"
              onChange={handleSearch}
            />
  )
}