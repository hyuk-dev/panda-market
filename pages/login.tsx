import AuthInput from "@/components/common/auth/AuthInput";
import Button from "@/components/common/Button";
import PasswordInput from "@/components/common/auth/PasswordInput";
import { ValidationCard } from "@/types/validationCard";
import verifyEmail from "@/utils/verifyEmail";
import verifyPassword from "@/utils/verifyPassword";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import SocialLogin from "@/components/common/auth/SocialLogin";
import Modal from "@/components/common/Modal";
import api from "@/utils/axiosInstance";
import AxiosError from "@/types/axiosError";
import SigninResponse from "@/types/signinResponse";
import { AuthContext } from "@/contexts/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { userData, setRefreshToken, setAccessToken } = useContext(AuthContext);

  useEffect(()=> {
    if (userData) router.push("/items");
  },[])

  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });

  const [validationData, setValidationData] = useState<ValidationCard>({
    email: "first", // first: 초기상태, passed: 통과, error: 에러
    password: "first",
  });

  const [isVerified, setIsVerified] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    verifyEmail({ email: inputData.email, setValidationData });
  }, [inputData.email]);

  useEffect(() => {
    verifyPassword({ password: inputData.password, setValidationData });
  }, [inputData.password]);

  useEffect(() => {
    let result = false;
    for (let key in validationData) {
      let isVerified = validationData[key as keyof ValidationCard];
      if (isVerified === "error" || isVerified === "first") {
        result = false;
        break;
      } else result = true;
    }
    setIsVerified(result);
  }, [validationData]);

  //로그인 처리 로직
  async function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await api.post(
        "https://panda-market-api.vercel.app/auth/signin",
        {
          email: inputData.email,
          password: inputData.password,
        }
      );
      const signinData = res.data as SigninResponse;
      //로컬 스토리지에 accessToken과 refreshToken을 저장해줌.
      localStorage.setItem("accessToken", signinData.accessToken);
      localStorage.setItem("refreshToken", signinData.refreshToken);
      setAccessToken(signinData.accessToken);
      setRefreshToken(signinData.refreshToken);

      router.push("/items");
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 400) {
        setModalMessage("비밀번호가 일치하지 않습니다.");
        setIsModal(true);
      }
    }
  }

  return (
    <>
      <form className="flex flex-col items-center mt-10" onSubmit={onLogin}>
        <div
          className="relative md:w-[396px] md:h-[132px] w-[198px] h-[66px] cursor-pointer mb-10"
          onClick={() => {
            router.push("/");
          }}
        >
          <Image
            src="/imgs/auth_logo.png"
            fill
            alt="인증 페이지 로고"
            objectFit="contain"
          />
        </div>
        <div className="flex flex-col md:w-[640px] w-[100%] gap-3 p-4">
          <div className="text-[18px] font-bold">이메일</div>
          <AuthInput
            placeholder="이메일을 입력해주세요"
            errorMessage="잘못된 이메일 형식입니다."
            isError={validationData.email === "error"}
            onChange={(e) =>
              setInputData({ ...inputData, email: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col md:w-[640px] w-[100%] gap-3 p-4">
          <div className="text-[18px] font-bold">비밀번호</div>
          <PasswordInput
            placeholder="비밀번호를 입력해주세요"
            errorMessage="잘못된 비밀번호 형식입니다."
            isError={validationData.password === "error"}
            onChange={(e) =>
              setInputData({ ...inputData, password: e.target.value })
            }
          />
        </div>
        <div className="mt-4 md:w-[640px] w-[100%] p-4 h-[56px]">
          <Button
            name="로그인"
            disabled={!isVerified}
            borderRadius={40}
            width="100%"
            height="54px"
          />
        </div>
        <div className="mt-6 md:w-[640px] w-[100%] p-4 h-[56px]">
          <SocialLogin />
        </div>
        <div className="flex justify-center gap-1 mt-20">
          <div>판다마켓이 처음이신가요?</div>
          <div className="text-[#3182F6]">
            <Link href="/register">회원가입</Link>
          </div>
        </div>
      </form>
      <Modal isShow={isModal} width="540px">
        <div className="flex flex-col gap-[40px] items-center">
          <div>{modalMessage}</div>
          <Button
            name="확인"
            disabled={false}
            width="70%"
            click={() => setIsModal(false)}
          />
        </div>
      </Modal>
    </>
  );
}
