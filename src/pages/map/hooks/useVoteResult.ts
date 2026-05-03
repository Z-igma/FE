import { useState } from 'react';
import type { Marker, Candidate, CardStatus } from '@/types/map';

interface UseVoteResultProps {
  markers: Marker[];
  votedPlaces: string[];
  votedPlace: string | null;
  isMultipleVoting: boolean;
}

// 투표 결과 계산 및 장소 확정 흐름 관리
export const useVoteResult = ({
  markers,
  votedPlaces,
  votedPlace,
  isMultipleVoting,
}: UseVoteResultProps) => {
  // 마커별 득표 수 계산
  const getVoteCount = (marker: Marker): number => {
    const key = `${marker.lat}_${marker.lng}`;
    if (isMultipleVoting) {
      return votedPlaces.filter(k => k === key).length;
    }
    return votedPlace === key ? 1 : 0;
  };

  const candidates: Candidate[] = markers.map((marker, index) => ({
    id: index,
    name: marker.placeName,
    distance: 0,
    address: marker.address,
    createMember: '나',
    voteMember: '',
    voteCount: getVoteCount(marker),
  }));

  const hasVote = candidates.some(c => c.voteCount > 0);
  const maxVote = Math.max(...candidates.map(c => c.voteCount));
  const topCandidates = candidates.filter(c => c.voteCount === maxVote);
  const isTie = topCandidates.length > 1;

  // 득표 수에 따른 카드 표시 상태 반환
  const getStatus = (voteCount: number): CardStatus => {
    if (voteCount !== maxVote) return null;
    return isTie ? 'tie' : 'best';
  };

  const [isRevote, setIsRevote] = useState(false);
  const isRevoteTie = false; // 재투표 후 동점 여부 (추후 연동)
  const [myVote, setMyVote] = useState<number | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmedCandidate, setConfirmedCandidate] =
    useState<Candidate | null>(null);

  // 재투표 중엔 동점 후보지만 표시
  const displayCandidates = isRevote
    ? candidates.filter(c => c.voteCount === maxVote)
    : candidates;

  // 현재 상태에 따른 버튼 텍스트
  const buttonText = isRevoteTie
    ? '임의로 장소 확정하기'
    : isRevote
      ? '장소 확정하기'
      : isTie
        ? '다시 투표하기'
        : '장소 결정하기';

  // 재투표 중엔 버튼 항상 활성화
  const buttonDisabled = isRevote ? false : !hasVote;

  // 확정 버튼 클릭 처리
  const handleConfirmClick = () => {
    if (isTie && !isRevote && !isRevoteTie) {
      setIsRevote(true);
    } else {
      const target = myVote
        ? candidates.find(c => c.id === myVote)
        : topCandidates[0];
      setConfirmedCandidate(target ?? null);
      setIsConfirmModalOpen(true);
    }
  };

  return {
    candidates,
    displayCandidates,
    isTie,
    isRevote,
    myVote,
    setMyVote,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    confirmedCandidate,
    buttonText,
    buttonDisabled,
    getStatus,
    handleConfirmClick,
  };
};
