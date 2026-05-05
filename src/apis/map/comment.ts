import { instance } from '../instance';
import type { ApiEnvelope } from '@/types/api.type';
import type {
  CommentItem,
  CommentListData,
  CreateCommentRequest,
  GetCommentsParams,
} from '@/types/map/comment.type';

// 코멘트 목록 조회
export const getComments = async (
  promiseId: number,
  params: GetCommentsParams,
): Promise<ApiEnvelope<CommentListData>> => {
  const res = await instance.get(`/promises/${promiseId}/comments`, { params });
  return res.data;
};

// 코멘트 생성
export const createComment = async (
  promiseId: number,
  body: CreateCommentRequest,
): Promise<ApiEnvelope<CommentItem>> => {
  const res = await instance.post(`/promises/${promiseId}/comments`, body);
  return res.data;
};
