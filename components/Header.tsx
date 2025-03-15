import logoImg from "@/public/imgs/panda_logo.png";
import Image from "next/image";
import Button from "./common/Button";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useContext, useEffect, useState } from "react";
import mobileLogoImg from "@/public/imgs/mobile_logo.png";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/AuthProvider";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import UserCard from "@/types/userCard";

export default function Header() {
  const { width, height } = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || ""; // 현재 경로를 보기 위해서
  const queryClient = useQueryClient();
  const { userData, isLoading = true } = useContext(AuthContext);
  
  const user = userData;
  console.log(user);

  useEffect(() => {
    if (width <= 768) setIsMobile(true);
    else setIsMobile(false);
  }, [width]);

  return (
    <div className="flex items-center border mb-6 h-[70px]">
      <div className="xl:ml-[200px] xl:mr-[200px] flex justify-between w-[100%] md:p-4 p-2">
        <div className="flex items-center">
          {!isMobile ? (
            <div
              className="relative w-[153px] h-[51px] mr-6 cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              <Image src={logoImg} alt="로고 이미지" fill priority />
            </div>
          ) : (
            <div
              className="relative w-[81px] h-[40px] mr-6 cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              <Image src={mobileLogoImg} fill alt="모바일 로고 이미지" />
            </div>
          )}
          <div className="flex gap-4">
            <div
              className={`h-[69px] flex items-center px-2 cursor-pointer ${
                pathname === "/board" || pathname.startsWith("/board/")
                  ? "text-[#3692FF] font-bold"
                  : "text-[#4B5563] font-bold"
              }`}
              onClick={() => {
                router.push("/board");
              }}
            >
              자유게시판
            </div>
            <div
              className={`h-[69px] flex items-center px-2 cursor-pointer ${
                pathname === "/items" || pathname.startsWith("/items/")
                  ? "text-[#3692FF] font-bold"
                  : "text-[#4B5563] font-bold"
              }`}
              onClick={() => {
                router.push("/items");
              }}
            >
              중고마켓
            </div>
          </div>
        </div>
        {isLoading ? null : user ? (
          <div className="flex items-center gap-3">
            <Image
              src="/imgs/ic_profile.png"
              alt="프로필 이미지"
              width={40}
              height={40}
            />
            <div className="hidden xl:block">{user.nickname}</div>
          </div>
        ) : (
          <div className="flex items-center">
            <Button
              name="로그인"
              disabled={false}
              click={() => {
                router.push("/login");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
