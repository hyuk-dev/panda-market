export function timeAgo(utcDateString: string): string {
  const utcDate = new Date(utcDateString); // UTC 날짜 객체 생성
  const now = new Date(); // 현재 로컬 시간
  const diffMs = now.getTime() - utcDate.getTime(); // 밀리초 차이 계산
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // 시간 단위 변환

  return `${diffHours}시간 전`;
}