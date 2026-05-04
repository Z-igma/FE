import { useQuery } from '@tanstack/react-query';
import { getPromises } from '@/apis/promise/promise';
import type { GetPromisesParams } from '@/types/promise/promise.type';

export const usePromises = (params?: GetPromisesParams) =>
  useQuery({
    queryKey: ['promises', params],
    queryFn: async () => {
      try {
        const data = await getPromises(params);
        console.log('약속 목록 조회 성공: ', data);
        return data;
      } catch (error) {
        console.error('약속 목록 조회 실패: ', error);
        throw error;
      }
    },
  });
