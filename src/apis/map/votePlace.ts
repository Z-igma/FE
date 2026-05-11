import { instance } from '../instance';
import type { ApiEnvelope, ApiEnvelopeNullable } from '@/types/api.type';
import type { AddCandidatePlaceRequest, AddCandidatePlaceResponse, ConfirmPlaceRequest, GetCandidatePlacesResponse, PostVoteRequest } from '@/types/map/votePlace.type';

// 투표 후보지 목록 조회
export const getCandidatePlaces = async (promiseId: string): Promise<ApiEnvelope<GetCandidatePlacesResponse>> => {
  const response = await instance.get(`/promises/${promiseId}/candidates`);
  return response.data;
};

// 투표 후보지 추가
export const addCandidatePlace = async (promiseId: string, body: AddCandidatePlaceRequest): Promise<ApiEnvelope<AddCandidatePlaceResponse>> => {
  const response = await instance.post(`/promises/${promiseId}/candidates`, body);
  return response.data;
};

// 투표 후보지 제거
export const deleteCandidatePlace = async (promiseId: string, candidateId: number): Promise<ApiEnvelope<void>> => {
  const response = await instance.delete(`/promises/${promiseId}/candidates/${candidateId}`);
  return response.data;
}

// 장소 투표
export const postVote = async (promiseId: string, body: PostVoteRequest): Promise<ApiEnvelopeNullable<null>> => {
  const response = await instance.post(`/promises/${promiseId}/votes`, body);
  return response.data;
};

// 장소 투표 취소
export const deleteVote = async (promiseId: string, candidateId: number): Promise<ApiEnvelopeNullable<null>> => {
  const response = await instance.delete(`/promises/${promiseId}/votes/${candidateId}`);
  return response.data;
};

// 장소 확정
export const confirmPlace = async (promiseId: string, body: ConfirmPlaceRequest): Promise<ApiEnvelopeNullable<null>> => {
  const response = await instance.post(`/promises/${promiseId}/confirmed`, body);
  return response.data;
};