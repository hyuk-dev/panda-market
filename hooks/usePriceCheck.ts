import { useState } from "react";

interface UsePriceCheckReturn {
  price: string;
  priceCheck: string;
  handlePriceInputChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export function usePriceCheck (priceInitial : string = ""): UsePriceCheckReturn {
    type Price = string;
    type PriceCheck = string;
    const [price, setPrice] = useState<Price>(priceInitial);
    const [priceCheck, setPriceCheck] = useState<PriceCheck>('first');

    function handlePriceInputChange(e: React.ChangeEvent<HTMLInputElement>) : void {
        const inputVal = e.target.value;
        setPrice(inputVal);
        handlePriceCheck(inputVal);
      }

      function handlePriceCheck(inputVal: string): void {
        const targetInput: string = inputVal;  // e.target.value 대신 currentTarget.value 사용
        // 숫자인지 확인 (정규식으로 숫자만 체크)
        const isValidPrice = /^[0-9]+$/.test(targetInput);  // 정규식으로 숫자만 검사
        
        if (isValidPrice) {
          setPriceCheck('checked');
        } else {
          setPriceCheck('notChecked');
        }

        if(targetInput === ""){
          setPriceCheck('first')
        }
      }

      return {price, priceCheck, handlePriceInputChange};
}