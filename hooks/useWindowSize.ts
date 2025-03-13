import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = (): WindowSize => {
  // 초기값은 0으로 설정 (서버 사이드에서 window 접근 방지)
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // 클라이언트에서만 실행되도록 체크
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 초기값 설정 & 이벤트 리스너 추가
    handleResize();
    window.addEventListener("resize", handleResize);

    // 클린업 함수로 이벤트 리스너 제거
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
