import { useState } from 'react';
import type { CandidatePlace } from '@/types/map/votePlace.type';
import type { Candidate, CardStatus } from '@/types/map';

interface UseVoteResultProps {
  candidatePlaces: CandidatePlace[];
  isMultipleVoting: boolean;
  isCreator: boolean;
}

export const useVoteResult = ({
  candidatePlaces,
  isMultipleVoting,
}: UseVoteResultProps) => {
  const candidates: Candidate[] = candidatePlaces.map(c => ({
    id: c.id,
    name: c.name,
    distance: c.distance,
    address: c.address,
    createMember: c.voteInfo.creator.nickname,
    voteMember: c.voteInfo.voters.map(v => v.nickname).join(', '),
    voteCount: c.voteInfo.voteCount,
  }));

  const hasVote = candidates.some(c => c.voteCount > 0);
  const maxVote = Math.max(0, ...candidates.map(c => c.voteCount));
  const topCandidates = candidates.filter(c => c.voteCount === maxVote);
  const isTie = hasVote && topCandidates.length > 1;

  const getStatus = (voteCount: number): CardStatus => {
    if (!hasVote || voteCount !== maxVote) return null;
    return isTie ? 'tie' : 'best';
  };

  const [isRevote, setIsRevote] = useState(false);
  const isRevoteTie = false;
  const [hasVoted, setHasVoted] = useState(false);
  const [myVote, setMyVote] = useState<number[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmedCandidate, setConfirmedCandidate] =
    useState<Candidate | null>(null);

  // 후보지 토글
  const handleSelect = (id: number) => {
    if (isMultipleVoting) {
      setMyVote(prev =>
        prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id],
      );
    } else {
      setMyVote(prev => (prev.includes(id) ? [] : [id]));
    }
  };

  const handleVoteSubmit = () => {
    if (myVote.length === 0) return;
    console.log('투표 제출 candidateId: ', myVote);
    setHasVoted(true);
  };

  const handleVoteCancel = () => {
    setHasVoted(false);
    setMyVote([]);
    console.log('투표 취소');
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
      const target =
        myVote.length > 0
          ? candidates.find(c => c.id === myVote[0])
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
    handleSelect,
  };
};
