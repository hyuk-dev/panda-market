import { Dispatch, SetStateAction } from "react";
interface VerifyEmailParams {
  password: string;
  setValidationData: Dispatch<
    SetStateAction<{
      email: string;
      password: string;
    }>
  >;
}
export default function verifyPassword({password, setValidationData}:VerifyEmailParams) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  if (!password){
    setValidationData((prevValidationData) => ({...prevValidationData, password:"first"}));
    return;
  }
  if (passwordRegex.test(password)){
    setValidationData((prevValidationData) => ({...prevValidationData, password:"passed"}));
  } else {
    setValidationData((prevValidationData) => ({...prevValidationData, password:"error"}));
  }
}
