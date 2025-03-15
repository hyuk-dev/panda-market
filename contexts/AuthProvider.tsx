import UserCard from "@/types/userCard";
import api from "@/utils/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface AuthContextCard {
  userData: UserCard | null;
  signout: () => void;
  accessToken: string;
  setAccessToken: Dispatch<SetStateAction<string>>;
  refreshToken: string;
  setRefreshToken: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextCard>({
  userData: null,
  signout: () => {},
  accessToken: "",
  refreshToken: "",
  setAccessToken: () => {},
  setRefreshToken: () => {},
  isLoading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  //accessToken, refreshToken을 state에 저장하자.
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    }
  }, [accessToken]);

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery<UserCard>({
    queryKey: ["userData"],
    queryFn: getUserData,
    enabled: !!refreshToken,
    initialData: () => {
      const cachedUser = queryClient.getQueryData<UserCard>(["userData"]);
      return cachedUser ?? undefined;
    },
    initialDataUpdatedAt: Date.now(), // ✅ 최신 데이터로 인식
  });

  function getToken() {
    const accessTokenData = localStorage.getItem("accessToken") as string;
    const refreshTokenData = localStorage.getItem("refreshToken") as string;

    if(accessTokenData) setAccessToken(accessTokenData);
    if(refreshTokenData) setRefreshToken(refreshTokenData);

    queryClient.invalidateQueries({ queryKey: ["userData"] });
  }

  async function getUserData() {
    console.log("getUserData 실행")
    try {
      const res = await api.get("https://panda-market-api.vercel.app/users/me");
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          if(refreshToken){
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              return await getUserData();
            }
          } else {
            return null;
          }
        } else {
          console.error("예상치 못한 에러 발생 : ", err);
        }
      }
    }
    return null;
  }

  async function refreshAccessToken() {
    try {
      const res = await api.post(
        "https://panda-market-api.vercel.app/auth/refresh-token",
        {
          refreshToken,
        }
      );
      const newAccessToken = res.data.accessToken;
      console.log(newAccessToken, "newAccessToken");
      localStorage.setItem("accessToken", newAccessToken);
      setAccessToken(newAccessToken);

      queryClient.invalidateQueries({ queryKey: ["userData"] });

      return newAccessToken;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log("토큰 갱신 실패", err);
        signout();
      }
      return null;
    }
  }

  async function signout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken("");
    setRefreshToken("");
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        userData: userData ?? null,
        isLoading,
        signout,
        refreshToken,
        accessToken,
        setAccessToken,
        setRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
