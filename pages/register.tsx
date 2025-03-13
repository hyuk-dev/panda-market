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
import { AuthContext } from "@/contexts/AuthProvider";
import SigninResponse from "@/types/signinResponse";
import { useQueryClient } from "@tanstack/react-query";

export default function RegisterPage() {
  const router = useRouter();
  const { userData, setAccessToken, setRefreshToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [inputData, setInputData] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordCheck: "",
  });

  useEffect(() => {
    if (userData) router.push("/items");
  }, []);

  const [validationData, setValidationData] = useState<ValidationCard>({
    email: "first", // first: 초기상태, passed: 통과, error: 에러
    password: "first",
  });

  const [isVerified, setIsVerified] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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

  async function onRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await api.post(
        "https://panda-market-api.vercel.app/auth/signup",
        {
          email: inputData.email,
          nickname: inputData.nickname,
          password: inputData.password,
          passwordConfirmation: inputData.passwordCheck,
        }
      );
      const signinData = res.data as SigninResponse;
      //로컬 스토리지에 accessToken과 refreshToken을 저장해줌.
      localStorage.setItem("accessToken", signinData.accessToken);
      localStorage.setItem("refreshToken", signinData.refreshToken);
      setAccessToken(signinData.accessToken);
      setRefreshToken(signinData.refreshToken);
      setModalMessage("가입 완료되었습니다.");
      setIsSuccess(true);
      setIsModal(true);
      queryClient.invalidateQueries({queryKey: ["userData"]});
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 400) {
        setModalMessage("사용 중인 이메일입니다.");
        setIsModal(true);
      } else {
        setModalMessage("회원가입 도중 알 수 없는 에러가 발생하였습니다.");
        setIsModal(true);
      }
    }
  }

  return (
    <>
      <form
        className="flex flex-col items-center mt-10 mb-10"
        onSubmit={onRegister}
      >
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
          <div className="text-[18px] font-bold">닉네임</div>
          <AuthInput
            placeholder="닉네임을 입력해주세요"
            errorMessage="닉네임은 5글자 이하로 입력해주세요."
            isError={inputData.nickname.length > 5}
            onChange={(e) =>
              setInputData({ ...inputData, nickname: e.target.value })
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
        <div className="flex flex-col md:w-[640px] w-[100%] gap-3 p-4">
          <div className="text-[18px] font-bold">비밀번호 확인</div>
          <PasswordInput
            placeholder="비밀번호를 다시 한 번 입력해주세요"
            errorMessage="비밀번호가 일치하지 않습니다."
            isError={inputData.password !== inputData.passwordCheck}
            onChange={(e) =>
              setInputData({ ...inputData, passwordCheck: e.target.value })
            }
          />
        </div>
        <div className="mt-4 md:w-[640px] w-[100%] p-4 h-[56px]">
          <Button
            name="회원가입"
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
          <div>이미 회원이신가요?</div>
          <div className="text-[#3182F6]">
            <Link href="/login">로그인</Link>
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
            click={
              isSuccess ? () => router.push("/items") : () => setIsModal(false)
            }
          />
        </div>
      </Modal>
    </>
  );
}
