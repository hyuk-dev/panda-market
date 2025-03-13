import { Dispatch, SetStateAction } from "react";
interface VerifyEmailParams {
  email: string;
  setValidationData: Dispatch<
    SetStateAction<{
      email: string;
      password: string;
    }>
  >;
}
export default function verifyEmail({email, setValidationData}:VerifyEmailParams) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!email){
    setValidationData((prevValidationData) => ({...prevValidationData, email:"first"}));
    return;
  }
  if (emailRegex.test(email)){
    setValidationData((prevValidationData) => ({...prevValidationData, email:"passed"}));
  } else {
    setValidationData((prevValidationData) => ({...prevValidationData, email:"error"}));
  }
}
