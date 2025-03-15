import getProduct from "@/api/getProduct";
import Comment from "@/components/Comment";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import MoreMenu from "@/components/common/MoreMenu";
import TagElement from "@/components/common/Tag";
import TagView from "@/components/common/TagView";
import Layout from "@/components/Layout";
import ProductCommentElement from "@/components/ProductComment";
import { AuthContext } from "@/contexts/AuthProvider";
import ProductCard from "@/types/productCard";
import ProductComment from "@/types/productComment";
import api from "@/utils/axiosInstance";
import {
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { comment } from "postcss";
import { useContext, useEffect, useState } from "react";

interface ProductCommentData {
  list: ProductComment[];
  nextCursor: number | null | undefined;
}

export default function ItemDetailPage() {
  const router = useRouter();
  const id = (router.query.id as string) || "";
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: ({ queryKey }) => {
      const productId = queryKey[1];
      if (!productId) return null; // ✅ null 방지
      return getProduct(productId);
    },
    enabled: !!id,
  });

  const product = data as ProductCard;
  const { userData } = useContext(AuthContext);
  const [imgError, setImgError] = useState(true);
  const [content, setContent] = useState(""); // 댓글 content
  const [isVerified, setIsVerified] = useState(false);
  const [isMenuBar, setIsMenuBar] = useState(false);
  const [isModal, setIsModal] = useState(false);
  function handleContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setContent(value);
  }

  useEffect(() => {
    if (content !== "") setIsVerified(true);
    else setIsVerified(false);
  }, [content]);

  async function getComments({
    pageParam,
    queryKey,
  }: {
    pageParam: number;
    queryKey: QueryKey;
  }) {
    const [, productId] = queryKey;
    if (!productId) return { list: [], nextCursor: null }; // productId가 없으면 빈 배열 반환
    const res = await api.get<ProductCommentData>(
      `https://panda-market-api.vercel.app/products/${productId}/comments/?limit=5&cursor=${pageParam}`
    );
    return {
      list: res.data.list,
      nextCursor: res.data.nextCursor ?? undefined,
    };
  }

  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ProductCommentData>({
    queryKey: ["comments", product?.id],
    queryFn: ({ pageParam, queryKey }) => {
      return getComments({
        pageParam: pageParam as number,
        queryKey: queryKey as QueryKey,
      });
    },
    enabled: !!product?.id,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐싱된 데이터 사용
    gcTime: 1000 * 60 * 10,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: 0,
  });

  const comments = commentData?.pages.flatMap((page) => page.list) ?? [];

  async function postCommit() {
    setIsVerified(false);
    await api.post(
      `https://panda-market-api.vercel.app/products/${product.id}/comments`,
      { content: content }
    );
    setContent("");
  }

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postCommit,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", product?.id] }),
  });

  async function deletePost() {
    try {
      await api.delete(
        `https://panda-market-api.vercel.app/products/${product.id}`
      );
      router.push("/items");
    } catch (err) {
      console.log(err);
      setIsModal(false);
    }
  }

  async function favoritePost() {
    try {
      await api.post(
        `https://panda-market-api.vercel.app/products/${product.id}/favorite`
      );
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    } catch (err) {
      console.log(err);
    }
  }

  async function favoriteDelete() {
    try {
      await api.delete(
        `https://panda-market-api.vercel.app/products/${product.id}/favorite`
      );
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    } catch (err) {
      console.log(err);
    }
  }

  if (isLoading)
    return (
      <Layout>
        <div>로딩중 ...</div>
      </Layout>
    );

  if (!product || !userData)
    return (
      <Layout>
        <div>로그인부터 진행해주세요.</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="flex flex-col w-[100%] gap-[40px]">
        <div className="flex gap-6">
          <div className="relative w-[486px] h-[486px] rounded-2xl overflow-hidden flex-shrink-0">
            <Image
              src={
                imgError || !product.images[0]
                  ? "/imgs/img_default.png"
                  : product.images[0]
              }
              alt="상품 이미지"
              fill
              onError={() => setImgError(true)}
              onLoadingComplete={() => setImgError(false)}
              objectFit="cover"
            />
          </div>
          <div className="flex flex-col gap-[62px] w-full">
            <div className="flex flex-col gap-[16px]">
              <div className="flex justify-between">
                <div className="flex flex-col gap-4">
                  <div className="text-[24px] font-semibold">
                    {product.name}
                  </div>
                  <div className="text-[40px] font-semibold">
                    {product.price.toLocaleString("ko-KR")}원
                  </div>
                </div>
                <div>
                  <MoreMenu
                    onUpdate={() => {
                      router.push(`/items/edit/${product.id}`);
                    }}
                    onDelete={() => {
                      setIsMenuBar(false);
                      setIsModal(true);
                    }}
                    isMenuBar={isMenuBar}
                    setIsMenuBar={setIsMenuBar}
                  />
                </div>
              </div>
              <hr />
              <div>
                <div className="mt-2 mb-5 font-semibold text-[#4B5563]">
                  상품 소개
                </div>
                <div className="text-[#4B5563]">{product.description}</div>
              </div>
              <div>
                <div className="mt-2 mb-5 font-semibold text-[#4B5563]">
                  상품 태그
                </div>
                <div className="flex gap-3">
                  {product.tags.map((tag, index) => {
                    return <TagView key={index}>{tag}</TagView>;
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <div className="relative w-[40px] h-[40px]">
                  <Image
                    src="/imgs/ic_profile.png"
                    alt="게시자 프로필 이미지"
                    fill
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>{product.ownerNickname}</div>
                  <div className="text-[#9CA3AF]">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {product.isFavorite ? (
                <div className="flex items-center border-l pl-6">
                  <div
                    onClick={() => favoriteDelete()}
                    className="cursor-pointer flex gap-1 border px-[12px] py-[4px] rounded-[35px] text-[#6B7280] text-[16px]"
                  >
                    <div className="relative w-[26.8px] h-[23.3px]">
                      <Image
                        src="/imgs/ic_heart_clicked.png"
                        alt="좋아요 이미지"
                        fill
                        objectFit="cover"
                      />
                    </div>
                    {product.favoriteCount}
                  </div>
                </div>
              ) : (
                <div className="flex items-center border-l pl-6">
                  <div
                    onClick={() => favoritePost()}
                    className="cursor-pointer flex gap-1 border px-[12px] py-[4px] rounded-[35px] text-[#6B7280] text-[16px]"
                  >
                    <div className="relative w-[26.8px] h-[23.3px]">
                      <Image
                        src="/imgs/ic_heart.png"
                        alt="좋아요 이미지"
                        fill
                        objectFit="cover"
                      />
                    </div>
                    {product.favoriteCount}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <hr />
        </div>
        <div>
          <div className="font-semibold mb-5">문의하기</div>
          <textarea
            placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
            className="focus:outline-[#3692FF] bg-[#F3F4F6] min-h-[104px] px-[24px] py-[16px] rounded-xl resize-none w-[100%]"
            onChange={handleContent}
            value={content}
          />
          <div className="flex justify-end mt-2">
            <Button
              name="등록"
              disabled={!isVerified}
              click={() => mutation.mutate()}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[40px]">
          {comments.map((comment, index) => {
            return (
              <ProductCommentElement
                comment={comment}
                productId={product.id}
                key={index}
              />
            );
          })}
          { hasNextPage &&
            <div className="flex justify-center" onClick={() => fetchNextPage()}>
            <div className="text-slate-500 bg-slate-50 p-2 rounded-xl cursor-pointer">댓글 더보기</div>
          </div>
          }
          {comments.length === 0 && (
            <div className="flex flex-col gap-5 items-center">
              <div className="relative w-[140px] h-[140px]">
                <Image
                  src="/imgs/Img_inquiry_empty.png"
                  fill
                  alt="문의 내역 없음"
                />
              </div>
              <div className="text-[#9CA3AF]">아직 문의가 없어요</div>
            </div>
          )}
        </div>
        <Link
          href={"/items"}
          className="flex gap-2 mx-auto bg-[#3692FF] text-[#F3F4F6] px-[64px] py-[12px] rounded-[40px] w-[280px] hover:bg-[#366cff]"
        >
          목록으로 돌아가기{" "}
          <div className="relative w-[24px] h-[24px]">
            <Image src="/imgs/ic_back.png" fill alt="뒤로가기" />
          </div>
        </Link>
      </div>
      <Modal isShow={isModal} width="300px">
        <div className="flex flex-col items-center justify-center gap-[24px]">
          <div className="relative w-[24px] h-[24px]">
            <Image src="/imgs/ic_check.png" alt="경고" fill objectFit="cover" />
          </div>
          <div>정말로 상품을 삭제하시겠어요?</div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModal(false)}
              className="hover:bg-zinc-100 w-[88px] border border-[#F74747] text-[#F74747] px-[23px] py-[12px] rounded-lg"
            >
              취소
            </button>
            <button
              onClick={() => deletePost()}
              className="hover:bg-[#f46060] bg-[#F74747] text-white px-[23px] py-[12px] rounded-lg w-[88px]"
            >
              네
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
