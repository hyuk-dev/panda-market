import Button from "@/components/common/Button";
import Layout from "@/components/Layout";
import api from "@/utils/axiosInstance";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

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
  }, [title, content]);

  async function onSubmit() {
    setIsVerified(false);
    try {
      await api.post("/article", {
        title: title,
        content: content,
      });
      router.push("/board");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Layout>
      <form className="flex flex-col gap-[32px] w-[100%] mb-[500px]">
        <div className=" flex justify-between">
          <div className="font-bold text-[20px]">게시글 쓰기</div>
          <Button name="등록" disabled={!isVerified} click={onSubmit} />
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-bold text-[18px]">*제목</div>
          <input
            placeholder="제목을 입력해주세요"
            className="focus:outline-[#3692FF] bg-[#F3F4F6] w-[100%] px-[24px] py-[16px] rounded-xl"
            onChange={handleTitle}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-bold text-[18px]">*내용</div>
          <textarea
            placeholder="내용을 입력해주세요"
            className="focus:outline-[#3692FF] bg-[#F3F4F6] w-[100%] px-[24px] py-[16px] rounded-xl min-h-[282px]"
            onChange={handleContent}
          />
        </div>
      </form>
    </Layout>
  );
}
