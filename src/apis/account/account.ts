import type { ApiEnvelope } from '@/types/api.type';
import { instance } from '../instance';
import type { MyInfo } from '@/types/account/account.type';

export const getMyInfo = async (): Promise<ApiEnvelope<MyInfo>> => {
  const res = await instance.get<ApiEnvelope<MyInfo>>('/users/mypage');
  return res.data;
};
