import { useContext, useEffect, useState } from "react";
import TagElement from "@/components/common/Tag";
import { useNameCheck } from "@/hooks/useNameCheck";
import { useDescriptionCheck } from "@/hooks/useDescriptionCheck";
import { usePriceCheck } from "@/hooks/usePriceCheck";
import { useTagCheck } from "@/hooks/useTagCheck";
import Layout from "@/components/Layout";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import InputArea from "@/components/common/InputArea";
import api from "@/utils/axiosInstance";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/AuthProvider";

interface Props {
  userEnv: string;
  setPageFocus: React.Dispatch<React.SetStateAction<string>>;
}

export default function UploadItemPage() {
    const { userData } = useContext(AuthContext);
  const { name, nameCheck, handleNameInputChange } = useNameCheck();
  const { description, descriptionCheck, handleDescriptionInputChange } =
    useDescriptionCheck();
  const { price, priceCheck, handlePriceInputChange } = usePriceCheck();
  const { tag, setTag, tagCheck, handleTagInputKeyDown, handleTagChange } =
    useTagCheck();

  const [verified, setVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (
      nameCheck === "checked" &&
      descriptionCheck === "checked" &&
      priceCheck === "checked"
    ) {
      setVerified(true);
    }
  }, [nameCheck, descriptionCheck, priceCheck, tagCheck]);

  async function handleRegisterClick(): Promise<void> {
    if (verified) {
      setVerified(false);
      await api.post(
        "https://panda-market-api.vercel.app/products",
        {
          name: name,
          description: description,
          price: Number(price),
          tags: tag,
          images: [],
        }
      );
    }
    router.push("/items")
  }

    if (!userData)
      return (
        <Layout>
          <div>로그인부터 진행해주세요.</div>
        </Layout>
      );

  return (
    <Layout>
      <div className="w-[100%] flex flex-col gap-[24px]">
        <div className="flex justify-between">
          <h3 className="text-[20px] font-bold">상품 등록하기</h3>
          <Button
            name="등록"
            disabled={!verified}
            click={handleRegisterClick}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-[18px] font-bold">상품명</h4>
          <Input
            placeholder="상품명을 입력해주세요"
            errorMessage="1자 이상, 10자 이내로 입력해주세요"
            onChange={handleNameInputChange}
            isError={nameCheck === "notChecked"}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-[18px] font-bold">상품 소개</h4>
          <InputArea
            placeholder="상품 소개를 입력해주세요"
            errorMessage="10자 이상, 100자 이내로 입력해주세요."
            onChange={handleDescriptionInputChange}
            isError={descriptionCheck === "notChecked"}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-[18px] font-bold">판매가격</h4>
          <Input
            placeholder="판매 가격을 입력해주세요"
            errorMessage="숫자로 입력해주세요"
            onChange={handlePriceInputChange}
            isError={priceCheck === "notChecked"}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-[18px] font-bold">태그</h4>
          <Input
            placeholder="태그를 입력해주세요"
            errorMessage="5글자 이내로 입력해주세요"
            onChange={handleTagChange}
            onKeyDown={handleTagInputKeyDown}
            isError={tagCheck === "notChecked"}
          />
        </div>
        <div className="flex gap-2">
          {tag &&
            tag.map((tagElement: string, index: number) => {
              return (
                <TagElement key={index} setTag={setTag} tag={tag}>
                  {tagElement}
                </TagElement>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}
