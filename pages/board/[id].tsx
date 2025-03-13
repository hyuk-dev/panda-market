import kebabImg from "@/public/imgs/ic_kebab.png";
import Image from "next/image";
import profileImg from "@/public/imgs/ic_profile.png";
import heart from "@/public/imgs/ic_heart.png";
import Button from "@/components/common/Button";
import Comment from "@/components/Comment";
import { ArticleCard } from "@/types/articleCard";
import { GetServerSideProps } from "next";
import api from "@/utils/axiosInstance";
import backImg from "@/public/imgs/ic_back.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import emptyComment from "@/public/imgs/Img_reply_empty.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentCard } from "@/types/commentCard";
import MoreMenu from "@/components/common/MoreMenu";
import Layout from "@/components/Layout";

export const getServerSideProps = (async (context) => {
  const id = context.params?.id;
  try {
    const res = await api.get<ArticleCard>(`/article/${id}`);
    const article = res.data;
    if (!article) {
      return { notFound: true };
    }
    return {
      props: { article },
    };
  } catch (err) {
    console.log(err);
    return { notFound: true };
  }
}) satisfies GetServerSideProps<{ article: ArticleCard }>;

interface PostProps {
  article: ArticleCard;
}

interface CommentData {
  comments: CommentCard[];
}

export default function EditPost({ article }: PostProps) {
  const [content, setContent] = useState(""); // 댓글 content
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const [isMenuBar, setIsMenuBar] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["comments", article.id],
    queryFn: getComments,
  });

  const comments = data?.data.comments;

  async function getComments() {
    const res = await api.get<CommentData>(`/comment/${article.id}`);
    return res;
  }

  function handleContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setContent(value);
  }

  useEffect(() => {
    if (content !== "") setIsVerified(true);
    else setIsVerified(false);
  }, [content]);

  async function postCommit() {
    setIsVerified(false);
    await api.post(`/comment/article/${article.id}`, { content: content });
    setContent("");
  }

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postCommit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", article.id] }),
  });

  async function deletePost() {
    try {
      await api.delete(`/article/${article.id}`);
    } catch (err) {
      console.log(err);
    }
    router.push("/board");
  }

  function updatePost() {
    router.push(`/board/edit/${article.idx}`);
  }

  return (
    <Layout>
      <div className="flex flex-col gap-[64px] w-[100%] min-h-[100vh]">
        <div className="flex flex-col gap-[16px]">
          <div className="flex justify-between">
            <div className="text-[20px] font-bold">{article.title}</div>
            <MoreMenu onUpdate={updatePost} onDelete={deletePost} isMenuBar={isMenuBar} setIsMenuBar={setIsMenuBar}/>
          </div>
          <div className="flex border-b pb-2 items-center gap-4">
            <div className="relative w-[40px] h-[40px]">
              <Image src={profileImg} fill alt="프로필 이미지" unoptimized />
            </div>
            <div className="text-[#4B5563]">익명</div>
            <div className="border-r pr-4 text-[#9CA3AF]">
              {new Date(article.updatedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center justify-center border rounded-[35px] gap-[10px] w-[87px] h-[40px]">
              <div className="relative w-[32px] h-[32px]">
                <Image src={heart} fill alt="좋아요" unoptimized />
              </div>
              <div>123</div>
            </div>
          </div>
          <div>{article.content}</div>
        </div>
        <div className="flex flex-col gap-[40px]">
          <div className="flex flex-col mt-2 gap-4">
            <div className="font-semibold ">댓글달기</div>

            <textarea
              placeholder="댓글을 입력해주세요."
              className="focus:outline-[#3692FF] bg-[#F3F4F6] min-h-[104px] px-[24px] py-[16px] rounded-xl resize-none"
              onChange={handleContent}
              value={content}
            />
            <div className="flex justify-end">
              <Button
                name="등록"
                disabled={!isVerified}
                click={() => mutation.mutate()}
              />
            </div>
          </div>

          {comments && comments.length > 0 ? (
            <div className="flex flex-col gap-10">
              {comments.map((comment, index) => {
                return <Comment comment={comment} key={index} />;
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-[140px] h-[140px]">
                <Image src={emptyComment} alt="댓글 없음" fill />
              </div>
              <div className="text-[#9CA3AF]">아직 댓글이 없어요,</div>
              <div className="text-[#9CA3AF]">댓글을 달아보세요!</div>
            </div>
          )}
        </div>

        <Link
          href={"/board"}
          className="flex gap-2 mx-auto bg-[#3692FF] text-[#F3F4F6] px-[64px] py-[12px] rounded-[40px] w-[280px] hover:bg-[#366cff]"
        >
          목록으로 돌아가기{" "}
          <div className="relative w-[24px] h-[24px]">
            <Image src={backImg} fill alt="뒤로가기" />
          </div>
        </Link>
      </div>
    </Layout>
  );
}
