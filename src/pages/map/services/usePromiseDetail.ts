import { useQuery } from '@tanstack/react-query';
import { getPromiseDetail } from '@/apis/promise/promise';
import type { PromiseDetail } from '@/types/promise/promise.type';

export const usePromiseDetail = (promiseId: number) => {
  return useQuery<PromiseDetail>({
    queryKey: ['promise', promiseId],
    queryFn: async () => {
      const res = await getPromiseDetail(promiseId);
      console.log('약속 상세 조회: ', res);
      return res.data;
    },
    enabled: !!promiseId,
  });
};
