import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addCandidatePlace, deleteCandidatePlace, deleteVote, getCandidatePlaces, postVote } from '@/apis/map/votePlace';
import type { AddCandidatePlaceRequest, PostVoteRequest } from '@/types/map/votePlace.type';
import axios from 'axios';

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
};

// 장소 투표
export const usePostVote = (promiseId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PostVoteRequest) => {
      if (!promiseId) {
        return Promise.reject(new Error("Promise ID is required"));
      }
      return postVote(promiseId, body);
    },
    onSuccess: () => {
      alert("투표가 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['candidatePlaces', promiseId] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 409) {
          const message = error.response?.data.message;
          if (message) {
            alert(message);
          }
        }
      }
    },
  });
};

// 장소 투표 취소
export const useDeleteVote = (promiseId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (candidateId: number) => {
      if (!promiseId) return Promise.reject(new Error("Promise ID is required"));
      return deleteVote(promiseId, candidateId);
    },
    onSuccess: () => {
      alert("투표가 취소되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['candidatePlaces', promiseId] });
    },
    onError: (error) => {
      console.error('투표 취소 실패: ', error);
    }
  })
};
