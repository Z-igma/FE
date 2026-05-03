// 지도에 표시되는 마커 정보
export interface Marker {
  lat: number;
  lng: number;
  placeName: string;
  address: string;
}

// 사용자가 클릭한 장소의 상세 정보
export interface SelectedPlace {
  placeName: string;
  address: string;
  proposedBy: string;
}

// 지도에 등록된 코멘트
export interface Comment {
  id: string;
  lat: number;
  lng: number;
  text: string;
}

// 투표 결과 카드 상태
export type CardStatus = 'best' | 'tie' | null;

// 투표 결과 후보지
export interface Candidate {
  id: number;
  name: string;
  distance: number;
  address: string;
  createMember: string;
  voteMember: string;
  voteCount: number;
}
