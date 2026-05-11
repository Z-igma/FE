import { instance } from '@/apis/instance';
import type { ApiEnvelope, ApiEnvelopeNullable } from '@/types/api.type';
import type { PostPromiseInviteCodeResponse } from '@/types/promise/invite.type';

// 약속 초대 코드 생성
export const postPromiseInviteCode = async (promiseId: string): Promise<ApiEnvelope<PostPromiseInviteCodeResponse>> => {
  const response = await instance.post(`/promises/${promiseId}/invite`);
  return response.data;
};

// 초대 코드를 통한 약속 참여 요청
export const postJoinPromise = async (inviteCode: string): Promise<ApiEnvelopeNullable<null>> => {
  const response = await instance.post(`/promises/invite/${inviteCode}`);
  return response.data;
};
