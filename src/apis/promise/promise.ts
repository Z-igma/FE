import { instance } from '../instance';
import type { ApiEnvelope } from '@/types/api.type';
import type {
  CreatePromiseRequest,
  GetPromisesParams,
  PromiseDetail,
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

// 약속 상세 조회
export const getPromiseDetail = async (
  promiseId: number,
): Promise<ApiEnvelope<PromiseDetail>> => {
  const res = await instance.get<ApiEnvelope<PromiseDetail>>(
    `/promises/${promiseId}`,
  );
  return res.data;
};
