import { getMyInfo } from '@/apis/account/account';
import type { MyInfo } from '@/types/account/account.type';
import { useQuery } from '@tanstack/react-query';

// 내 정보 조회
export const useAccountInfo = () => {
  return useQuery<MyInfo>({
    queryKey: ['myInfo'],
    queryFn: async () => {
      const res = await getMyInfo();
      return res.data;
    },
  });
};
