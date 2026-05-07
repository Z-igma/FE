import { instance } from '../instance';
import type { ApiEnvelope } from '@/types/api.type';
import type { AddCandidatePlaceRequest, AddCandidatePlaceResponse, GetCandidatePlacesResponse } from '@/types/map/votePlace.type';

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