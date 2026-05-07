// 투표 후보지 리스트 반환
export interface CandidatePlace {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  distance: number;
  isConfirmed: boolean;
};

export interface GetCandidatePlacesResponse {
  candidates: CandidatePlace[];
  count: number;
};

// 투표 후보지 추가 
export interface AddCandidatePlaceRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
};

export interface AddCandidatePlaceResponse {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  distance: number;
  isConfirmed: boolean;
};
