import Image from "next/image";

export default function SocialLogin() {
  return (
    <div className="bg-[#E6F2FF] w-[100%] h-[74px] flex justify-between items-center px-[23px] py-[16px] rounded-lg">
      <div>간편 로그인 하기</div>
      <div className="flex gap-4">
        <div>
          <Image
            src="/imgs/google_login.png"
            width={42}
            height={42}
            alt="구글 로그인"
          />
        </div>
        <div>
          <Image
            src="/imgs/kakao_login.png"
            width={42}
            height={42}
            alt="카카오 로그인"
          />
        </div>
      </div>
    </div>
  );
}
