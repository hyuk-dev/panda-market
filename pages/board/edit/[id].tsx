import Button from "@/components/common/Button";
import ServLayout from "@/components/Layout";
import { ArticleCard } from "@/types/articleCard";
import api from "@/utils/axiosInstance";
import { GetServerSideProps } from "next";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const getServerSideProps = (async (context) => {
  const id = context.params?.id;
  if (!id) return { notFound: true };
  try {
    const res = await api.get<ArticleCard>(`/article/${id}`);
    const article = res.data;
    if (!article) return { notFound: true };
    return {
      props: { article },
    };
  } catch (err) {
    return { notFound: true };
  }
}) satisfies GetServerSideProps<{ article: ArticleCard }>;

interface EditProps {
  article: ArticleCard;
}

export default function Edit({ article }: EditProps) {
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const id = router.query["id"];

  function handleTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTitle(value);
  }

  function handleContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setContent(value);
  }

  useEffect(() => {
    if (title !== "" && content !== "") setIsVerified(true);
    else setIsVerified(false);
  }, [title, content]);

  async function onSubmit() {
    setIsVerified(false);
    try {
      await api.patch(`/article/${article.id}`, {
        title: title,
        content: content,
      });
      router.push(`/board/${article.idx}`);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <ServLayout>
      <form className="flex flex-col gap-[32px] w-[100%] mb-[500px]">
        <div className=" flex justify-between">
          <div className="font-bold text-[20px]">게시글 수정</div>
          <Button name="수정" disabled={!isVerified} click={onSubmit} />
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-bold text-[18px]">*제목</div>
          <input
            placeholder="제목을 입력해주세요"
            className="focus:outline-[#3692FF] bg-[#F3F4F6] w-[100%] px-[24px] py-[16px] rounded-xl"
            onChange={handleTitle}
            value={title}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-bold text-[18px]">*내용</div>
          <textarea
            placeholder="내용을 입력해주세요"
            className="focus:outline-[#3692FF] bg-[#F3F4F6] w-[100%] px-[24px] py-[16px] rounded-xl min-h-[282px]"
            onChange={handleContent}
            value={content}
          />
        </div>
      </form>
    </ServLayout>
  );
}
