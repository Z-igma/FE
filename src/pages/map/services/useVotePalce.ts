import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addCandidatePlace, deleteCandidatePlace, getCandidatePlaces } from '@/apis/map/votePlace';
import type { AddCandidatePlaceRequest } from '@/types/map/votePlace.type';

// 투표 후보지 목록 조회
export const useGetCandidatePlaces = (promiseId?: string) => {
  return useQuery({
    queryKey: ['candidatePlaces', promiseId],
    queryFn: () => {
      if (!promiseId) {
        return Promise.reject(new Error("Promise ID is required"));
      }
      return getCandidatePlaces(promiseId);
    },
    enabled: !!promiseId,
  });
};

// 투표 후보지 추가
export const useAddCandidatePlace = (promiseId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AddCandidatePlaceRequest) => {
      if (!promiseId) {
        return Promise.reject(new Error("Promise ID is required"));
      } else {
        return addCandidatePlace(promiseId, body);
      }
    },
    onSuccess: res => {
      console.log('투표 후보지 추가 성공: ', res); 
      queryClient.invalidateQueries({ queryKey: ['candidatePlaces', promiseId] });
    },
    onError: error => { console.error('투표 후보지 추가 실패: ', error); },
  });
};

// 투표 후보지 제거
export const useDeleteCandidatePlace = (promiseId?: string, candidateId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!promiseId || !candidateId) {
        return Promise.reject(new Error("Promise ID is required"));
      } else {
        return deleteCandidatePlace(promiseId, candidateId);
      }
    },
    onSuccess: res => {
      console.log('투표 후보지 제거 성공: ', res);
      queryClient.invalidateQueries({ queryKey: ['candidatePlaces', promiseId] });
    },
    onError: error => {
      console.error('투표 후보지 제거 실패: ', error);
    },
  })
}