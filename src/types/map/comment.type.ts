// 코멘트
export interface CommentItem {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string;
  content: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

// 코멘트 생성 요청 바디
export interface CreateCommentRequest {
  content: string;
  latitude: number;
  longitude: number;
}

// 코멘트 조회 쿼리 파라미터
export interface GetCommentsParams {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

// 코멘트 목록 조회 응답 데이터
export interface CommentListData {
  comments: CommentItem[];
  count: number;
}
