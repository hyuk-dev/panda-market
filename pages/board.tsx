import BestArticle from "@/components/BestArticle";
import Image from "next/image";
import Article from "@/components/Article";
import Button from "@/components/common/Button";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import { GetServerSideProps } from "next";
import { ArticleCard } from "@/types/articleCard";
import { useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useRouter } from "next/router";
import { refresh } from "@/utils/refresh";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/common/SearchBar";
import SortMenu from "@/components/common/SortMenu";
import Layout from "@/components/Layout";

interface ArticleData {
  articles: ArticleCard[];
  totalSize: number;
}

export default function BoardPage() {
  const [searchVal, setSearchVal] = useState("");
  const { width, height } = useWindowSize();
  const [maxCount, setMaxCount] = useState(3);
  const [order, setOrder] = useState("newest");
  const router = useRouter();
  const debounceSearchVal = useDebounce<string>(searchVal, 1000);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles", debounceSearchVal, order],
    queryFn: () => getArticlesByKeyword(debounceSearchVal, order),
    staleTime: 60 * 1000,
  });

  const articles = data?.data.articles;
  console.log(articles);

  useEffect(() => {
    if (width > 1280) setMaxCount(3);
    else if (width > 768) setMaxCount(2);
    else setMaxCount(1);
  }, [width]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchVal(value);
  }

  async function getArticlesByKeyword(keyword: string, order: string) {
    const res = await api.get<ArticleData>(
      `/article/?keyword=${keyword}&order=${order}`
    );
    return res;
  }

  return (
    <Layout>
      <div className="flex flex-col gap-[40px] min-h-[100vh] w-[100%]">
        <div className="text-[#1F2937] flex flex-col gap-[24px]">
          <h3 className="text-[20px] font-bold">베스트 게시글</h3>
          <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[24px]">
            {articles?.map((article, index) => {
              if (index < maxCount)
                return (
                  <Link
                    key={`bestArticle-${article.id}`}
                    href={`/board/${article.idx}`}
                  >
                    <BestArticle article={article} />
                  </Link>
                );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-[24px]">
          <div className="flex justify-between items-center">
            <h3 className="text-[#1F2937] text-[20px] font-bold">게시글</h3>
            <Link href="/board/write">
              <Button name="글쓰기" disabled={false} />
            </Link>
          </div>
          <div className="flex justify-between gap-3">
            <SearchBar handleSearch={handleSearch} />
            <SortMenu width={width} order={order} setOrder={setOrder} />
          </div>
          {articles?.map((article, index) => {
            return (
              <Link
                key={`article-${article.id}`}
                href={`/board/${article.idx}`}
              >
                <Article article={article} />
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
