import { useState } from 'react';
import type { Marker, Candidate, CardStatus } from '@/types/map';

interface UseVoteResultProps {
  markers: Marker[];
  votedPlaces: string[];
  votedPlace: string | null;
  isMultipleVoting: boolean;
}

export const useVoteResult = ({
  markers,
  votedPlaces,
  votedPlace,
  isMultipleVoting,
}: UseVoteResultProps) => {
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

  const getStatus = (voteCount: number): CardStatus => {
    if (voteCount !== maxVote) return null;
    return isTie ? 'tie' : 'best';
  };

  const [isRevote, setIsRevote] = useState(true);
  const isRevoteTie = false;
  const [myVote, setMyVote] = useState<number | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmedCandidate, setConfirmedCandidate] =
    useState<Candidate | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVoteSubmit = () => {
    if (myVote === null) return;
    console.log('투표 제출 candidateId: ', myVote);
    setHasVoted(true);
  };

  const handleVoteCancel = () => {
    setHasVoted(false);
    setMyVote(null);
    console.log('투표 취소 candidateId: ', myVote);
  };

  const displayCandidates = isRevote
    ? candidates.filter(c => c.voteCount === maxVote)
    : candidates;

  const sortedCandidates = [...displayCandidates].sort(
    (a, b) => b.voteCount - a.voteCount,
  );

  // 방장 버튼 텍스트
  const buttonText = isRevoteTie
    ? '임의로 장소 확정하기'
    : isRevote
      ? '장소 확정하기'
      : isTie
        ? '다시 투표하기'
        : '장소 결정하기';

  const buttonDisabled = isRevote ? false : !hasVote;

  // 방장이 확정
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
    sortedCandidates,
    myVote,
    setMyVote,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    confirmedCandidate,
    buttonText,
    buttonDisabled,
    getStatus,
    handleConfirmClick,
    isTie,
    hasVoted,
    handleVoteSubmit,
    handleVoteCancel,
  };
};
