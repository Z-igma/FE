import { instance } from '../instance';
import type { ApiEnvelope } from '@/types/api.type';
import type {
  CreatePromiseRequest,
  GetPromisesParams,
  PromiseItem,
  PromiseListData,
} from '@/types/promise/promise.type';

// 약속 생성
export const createPromise = async (
  body: CreatePromiseRequest,
): Promise<ApiEnvelope<PromiseItem>> => {
  const res = await instance.post('/promises', body);
  return res.data;
};

// 약속 목록 조회
export const getPromises = async (
  params?: GetPromisesParams,
): Promise<ApiEnvelope<PromiseListData>> => {
  const res = await instance.get('/promises', { params });
  return res.data;
};
