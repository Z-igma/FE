import { instance } from '../instance';
import type { ApiEnvelope } from '@/types/api.type';
import type {
  CreatePromiseRequest,
  PromiseItem,
} from '@/types/promise/promise.type';

export const createPromise = async (
  body: CreatePromiseRequest,
): Promise<ApiEnvelope<PromiseItem>> => {
  const res = await instance.post('/promises', body);
  return res.data;
};
