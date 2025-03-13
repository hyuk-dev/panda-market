import badge from "@/public/imgs/ic_medal.png";
import heart from "@/public/imgs/ic_heart.png";
import notebook from "@/public/imgs/notebook.png";
import Image from "next/image";
import { ArticleCard } from "@/types/articleCard";

interface BestArticleProps {
  article: ArticleCard;
}

export default function BestArticle({ article }: BestArticleProps) {
  return (
    <div className="flex flex-col gap-[10px] h-[169px] rounded-lg bg-[#F9FAFB] px-[24px] w-[100%]">
      <div className="flex bg-[#3692FF] py-[2px] px-[24px] rounded-b-[16px] w-[102px] h-[30px] gap-[10px] items-center">
        <div className="relative w-[12.39px] h-[14.91px]">
          <Image src={badge} fill alt="뱃지" style={{ objectFit: "cover" }} />
        </div>
        <div className="text-white text-[16px] font-semibold">Best</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-[20px] font-semibold w-[256px]">
          {article.title}
        </div>
        <div className=" bg-white w-[72px] h-[72px] rounded-[6px] flex justify-center items-center">
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
      <div className="flex justify-between">
        <div className="flex items-center gap-2 text-[#4B5563]">
          <div>익명</div>
          <div className="flex items-center gap-1">
            <div className="relative w-[13.4px] h-[11.65px]">
              <Image src={heart} fill alt="좋아요" />
            </div>
            <div>9999+</div>
          </div>
        </div>
        <div className="text-[#9CA3AF]">
          {new Date(article.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
