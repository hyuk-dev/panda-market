import Button from "@/components/common/Button";
import SearchBar from "@/components/common/SearchBar";
import SortMenu from "@/components/common/SortMenu";
import Product from "@/components/Product";
import { useWindowSize } from "@/hooks/useWindowSize";
import ProductCard from "@/types/productCard";
import api from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useDebounce from "@/hooks/useDebounce";
import SelectPage from "@/components/common/Paginiation";

interface ProductList {
  list: ProductCard[];
  totalCount: number;
}

export default function ItemsPage() {
  const [searchVal, setSearchVal] = useState("");
  const { width, height } = useWindowSize();
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState("recent");

  useEffect(() => {
    if (width >= 1280) setPageSize(10);
    else if (width >= 768) setPageSize(6);
    else setPageSize(4);
  }, [width]);

  const router = useRouter();
  const debounceSearchVal = useDebounce<string>(searchVal, 1000);
  const { data, isError, isLoading } = useQuery({
    queryFn: () => getItems(debounceSearchVal, pageSize, page, orderBy),
    queryKey: ["items", debounceSearchVal, pageSize, page, orderBy],
  });

  const products = data?.list; // 상품 데이터가 저장됨
  const totalCount = data?.totalCount; // 총 데이터 수가 저장됨

  async function getItems(
    searchVal: string,
    pageSize: number,
    page: number,
    orderBy: string
  ) {
    const res = await api.get<ProductList>(
      `https://panda-market-api.vercel.app/products/?keyword=${searchVal}&pageSize=${pageSize}&page=${page}&orderBy=${orderBy}`
    );
    return res.data;
  }
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchVal(value);
  }
  return (
    <Layout>
      <div className="flex flex-col gap-[40px] min-h-[100vh] w-[100%]">
        {width > 768 ? (
          <div className="flex justify-between items-center">
            <h3 className="text-[20px] font-bold">판매 중인 상품</h3>
            <div className="flex gap-4 items-center">
              <SearchBar handleSearch={handleSearch} width="310px" />
              <Link href="/items/write">
                <Button height="42px" name="상품 등록하기" disabled={false} />
              </Link>
              <SortMenu width={width} order={orderBy} setOrder={setOrderBy} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center justify-between">
              <h3 className="text-[20px] font-bold">판매 중인 상품</h3>
              <Link href="/items/write">
                <Button height="42px" name="상품 등록하기" disabled={false} />
              </Link>
            </div>
            <div className="flex gap-4 items-center">
              <SearchBar handleSearch={handleSearch} width="100%" />
              <SortMenu width={width} order={orderBy} setOrder={setOrderBy} />
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center w-[100%]">로딩중 ...</div>
        )}
        <div className="grid xl:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-6">
          {products &&
            products.map((product, index) => {
              return (
                <Link href={`/items/${product.id}`} key={index}>
                  <Product product={product} />
                </Link>
              );
            })}
        </div>
        <div className="flex justify-center mt-8">
          <div className="flex gap-1">
            <SelectPage
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              totalCount={totalCount ?? 1}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
