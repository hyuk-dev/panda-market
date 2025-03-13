import profileImg from "@/public/imgs/ic_profile.png";
import notebook from "@/public/imgs/notebook.png";
import Image from "next/image";
import heart from "@/public/imgs/ic_heart.png";
import { ArticleCard } from "@/types/articleCard";

interface ArticleProps {
  article: ArticleCard;
}

export default function Article({ article }: ArticleProps) {
  return (
    <div className="flex flex-col justify-between h-[138px]">
      <div className="flex justify-between">
        <div className="text-[20px] font-semibold">{article.title}</div>
        <div className=" bg-white w-[72px] h-[72px] rounded-[6px] flex justify-center items-center border border-[#F3F4F6]">
          <div className="relative w-[48px] h-[44.57px]">
            <Image
              src={notebook}
              fill
              alt="노트북"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-between">
        <div className="flex gap-[8px]">
          <div className="relative w-[24px] h-[24px]">
            <Image fill src={profileImg} alt="프로필 이미지" />
          </div>
          <div className="text-[#4B5563]">익명</div>
          <div className="text-[#9CA3AF]">
            {new Date(article.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <div className="relative w-[13.4px] h-[11.65px]">
              <Image src={heart} fill alt="좋아요" />
            </div>
            <div className="text-[#6B7280]">9999+</div>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}
