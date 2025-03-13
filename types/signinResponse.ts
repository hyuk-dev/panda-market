import UserCard from "./userCard";

export default interface SigninResponse{
  user: UserCard;
  accessToken: string;
  refreshToken: string;
}