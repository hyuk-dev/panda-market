import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5004",
  timeout: 5000, // 5초 제한
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (요청을 보내기 전에 실행)
const tokenInterceptor = (config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken, "axios accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
};

api.interceptors.request.use(tokenInterceptor);
export default api;
