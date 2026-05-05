import { useMutation } from '@tanstack/react-query';
import { createPromise } from '@/apis/promise/promise';

export const useCreatePromiseMutation = () =>
  useMutation({
    mutationFn: createPromise,
    onSuccess: res => {
      console.log('약속 생성 성공 ID: ', res.data.id);
    },
    onError: message => {
      console.error('약속 생성 실패: ', message);
    },
  });
