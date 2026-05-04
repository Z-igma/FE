// 약속 생성 요청 바디
export interface CreatePromiseRequest {
  title: string;
  promisedAt: string; // 2026-04-28T21:26:12
  category: string;
  endAt?: string; // 선택
  isMultipleVoting?: boolean; // 선택
}

// 약속 생성 응답 데이터
export interface PromiseItem {
  id: number;
  title: string;
  planStatus: string;
  promisedAt: string;
  dayOfWeek: string;
  memberCount: number;
}
