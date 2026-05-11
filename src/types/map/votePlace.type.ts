// 투표 후보지 리스트 반환
export interface VoteInfo {
  creator: {
    userId: number;
    nickname: string;
  };
  voteCount: number;
  voters: { userId: number; nickname: string }[];
  isMyVote: boolean;
  isMyCandidate: boolean;
}

export interface CandidatePlace {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  distance: number;
  isConfirmed: boolean;
  voteInfo: VoteInfo;
};

export interface GetCandidatePlacesResponse {
  candidates: CandidatePlace[];
  candidateCount: number;
  totalMemberCount: number;
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

// 장소 투표
export interface PostVoteRequest {
  candidateId: number;
};
