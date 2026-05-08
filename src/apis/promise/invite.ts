import { instance } from '@/apis/instance';
import type { ApiEnvelope } from '@/types/api.type';
import type { PostPromiseInviteCodeResponse } from '@/types/promise/invite.type';

// 약속 초대 코드 생성
export const postPromiseInviteCode = async (promiseId: string): Promise<ApiEnvelope<PostPromiseInviteCodeResponse>> => {
  const response = await instance.post(`/promises/${promiseId}/invite`);
  return response.data;
};
