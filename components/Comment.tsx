import kebabImg from "@/public/imgs/ic_kebab.png";
import Image from "next/image";
import profileImg from "@/public/imgs/ic_profile.png";
import { CommentCard } from "@/types/commentCard";
import { timeAgo } from "@/utils/timeAgo";
import { useEffect, useState } from "react";
import Button from "./common/Button";
import api from "@/utils/axiosInstance";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MoreMenu from "./common/MoreMenu";
import ProductComment from "@/types/productComment";

interface CommentProps {
  comment: CommentCard;
}

export default function Comment({ comment }: CommentProps) {
  const [isMenuBar, setIsMenuBar] = useState(false);
  const [isEditMod, setIsEditMod] = useState(false);
  const [commentVal, setCommentVal] = useState(comment.content);
  const [isVerified, setIsVerified] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (commentVal === "") setIsVerified(false);
    else setIsVerified(true);
  }, [commentVal]);

  const mutation = useMutation({
    mutationFn: patchComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments"] }),
  });

  const router = useRouter();

  function handleEditMod() {
    setIsMenuBar(false);
    setIsEditMod(true);
  }

  function handleCancel() {
    setIsEditMod(false);
  }

  function handleCommentVal(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setCommentVal(value);
  }

  async function patchComment() {
    setIsEditMod(false);
    await api.patch(`/comment/${comment.id}`, {
      content: commentVal,
    });
  }

  const deleteComment = useMutation<void, Error, string>({
    mutationFn: async (commentId: string) => {
      await api.delete(`/comment/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] }); // 삭제 후 최신 데이터 갱신
      setIsMenuBar(false);
    },
  });

  return (
    <div className="bg-[#FCFCFC] flex flex-col gap-6 border-b pb-3">
      <div className="flex justify-between">
        {!isEditMod ? (
          <>
            <div>{comment.content}</div>
            <MoreMenu onUpdate={handleEditMod} onDelete={() => deleteComment.mutate(String(comment.id))} isMenuBar={isMenuBar} setIsMenuBar={setIsMenuBar}/>
          </>
        ) : (
          <div className="w-[100%]">
            <textarea
              className="focus:outline-[#3692FF] bg-[#F3F4F6] w-[100%] rounded-xl px-[24px] py-[16px] h-[80px] resize-none"
              defaultValue={comment.content}
              onChange={handleCommentVal}
            />
          </div>
        )}
      </div>
      {isEditMod ? (
        <div className="flex justify-between">
          <div className="flex gap-3">
            <div className="relative w-[40px] h-[40px]">
              <Image
                src={profileImg}
                fill
                alt="프로필 이미지"
                objectFit="cover"
                unoptimized
              />
            </div>
            <div>
              <div className="text-[#4B5563]">익명</div>
              <div className="text-[#9CA3AF]">{timeAgo(comment.createdAt)}</div>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <div className="cursor-pointer" onClick={handleCancel}>
              취소
            </div>
            <Button
              name="수정 완료"
              disabled={!isVerified}
              click={() => mutation.mutate()}
            />
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="relative w-[40px] h-[40px]">
            <Image
              src={profileImg}
              fill
              alt="프로필 이미지"
              objectFit="cover"
              unoptimized
            />
          </div>
          <div>
            <div className="text-[#4B5563]">익명</div>
            <div className="text-[#9CA3AF]">{timeAgo(comment.createdAt)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
