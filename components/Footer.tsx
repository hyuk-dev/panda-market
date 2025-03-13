import Image from "next/image";
import facebookImg from "@/public/imgs/ic_facebook.png";
import youtubeImg from "@/public/imgs/ic_youtube.png";
import instagramImg from "@/public/imgs/ic_instagram.png";
import twitterImg from "@/public/imgs/ic_twitter.png";

export default function Footer() {
  return (
    <div className="bg-[#111827] h-[160px] mt-36">
      <div className="xl:ml-[400px] xl:mr-[400px] flex xl:justify-between items-center xl:flex-row flex-col pt-8 gap-2">
        <div className="text-[#9CA3AF]">ⓒ codeit - 2024</div>
        <div className="flex text-[#E5E7EB] gap-[30px]">
          <div>Privacy Policy</div>
          <div>FAQ</div>
        </div>
        <div className="flex gap-[12px]">
          <div className="relative w-[18px] h-[18px]">
            <Image src={facebookImg} fill alt="페이스북" />
          </div>
          <div className="relative w-[18px] h-[18px]">
            <Image src={twitterImg} fill alt="트위터" />
          </div>
          <div className="relative w-[18px] h-[18px]">
            <Image src={youtubeImg} fill alt="유튜브"  />
          </div>
          <div className="relative w-[18px] h-[18px]">
            <Image src={instagramImg} fill alt="인스타그램"  />
          </div>
        </div>
      </div>
    </div>
  );
}
