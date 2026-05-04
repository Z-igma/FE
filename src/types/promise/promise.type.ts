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
  promiseStatus: string;
  promisedAt: string;
  dayOfWeek: string;
  memberCount: number;
}

// 약속 목록 조회 요청 파라미터
export interface GetPromisesParams {
  cursor?: string;
  size?: number;
}

// 약속 목록 조회 응답 데이터
export interface PromiseListData {
  promises: PromiseItem[];
  cursor: string;
  count: number;
  hasNext: boolean;
}
