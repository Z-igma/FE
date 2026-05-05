import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment } from '@/apis/map/comment';
import type {
  CreateCommentRequest,
  GetCommentsParams,
} from '@/types/map/comment.type';

// 코멘트 목록 조회
export const useComments = (promiseId: number, params: GetCommentsParams) => {
  return useQuery({
    queryKey: ['comments', promiseId, params],
    queryFn: async () => {
      try {
        const res = await getComments(promiseId, params);
        console.log('코멘트 조회 성공: ', res);
        return res.data.comments;
      } catch (error) {
        console.error('코멘트 조회 실패: ', error);
        throw error;
      }
    },
  });
};

// 코멘트 생성
export const useCreateComment = (promiseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCommentRequest) => createComment(promiseId, body),
    onSuccess: res => {
      console.log('코멘트 생성 성공: ', res);
      queryClient.invalidateQueries({ queryKey: ['comments', promiseId] });
    },
    onError: error => {
      console.error('코멘트 생성 실패: ', error);
    },
  });
};
