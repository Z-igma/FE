// 정보 조회 응답 데이터
export interface MyInfo {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  bio: string | null;
  joinedPromiseCount: number;
  hostedPromiseCount: number;
}
