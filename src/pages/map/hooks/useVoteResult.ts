import { useState } from 'react';
import { usePostVote, useDeleteVote, useConfirmPlace } from '../services/useVotePalce';
import type { CandidatePlace } from '@/types/map/votePlace.type';
import type { Candidate, CardStatus } from '@/types/map';

interface UseVoteResultProps {
  candidatePlaces: CandidatePlace[];
  isMultipleVoting: boolean;
  promiseId?: string;
}

export const useVoteResult = ({
  candidatePlaces,
  isMultipleVoting,
  promiseId,
}: UseVoteResultProps) => {
  const { mutateAsync: postVote } = usePostVote(promiseId);
  const { mutateAsync: deleteVote } = useDeleteVote(promiseId);
  const { mutateAsync: confirmPlace } = useConfirmPlace(promiseId);


  const candidates: Candidate[] = candidatePlaces.map(c => ({
    id: c.id,
    name: c.name,
    distance: c.distance,
    address: c.address,
    createMember: c.voteInfo.creator.nickname,
    voteMember: c.voteInfo.voters
      .filter(v => v.userId !== c.voteInfo.creator.userId)
      .map(v => v.nickname)
      .join(', '),
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

  // isMyVote로 초기 투표 상태 세팅
  const initialMyVote = candidatePlaces
    .filter(c => c.voteInfo.isMyVote)
    .map(c => c.id);

  const [hasVoted, setHasVoted] = useState(initialMyVote.length > 0);
  const [myVote, setMyVote] = useState<number[]>(initialMyVote);
  const [previousVote, setPreviousVote] = useState<number[]>(initialMyVote);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmedCandidate, setConfirmedCandidate] = useState<Candidate | null>(null);

  const handleSelect = (id: number) => {
    if (isMultipleVoting) {
      setMyVote(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
    } else {
      setMyVote(prev => prev.includes(id) ? [] : [id]);
    }
  };

  // 기존 투표 취소 후 새로 투표
  const handleVoteSubmit = async () => {
    if (myVote.length === 0) return;
    try {
      if (previousVote.length > 0) {
        await Promise.all(previousVote.map(id => deleteVote(id)));
      }
      await Promise.all(myVote.map(id => postVote({ candidateId: id })));
      setPreviousVote(myVote);
      setHasVoted(true);
    } catch {
        // 에러는 usePostVote onError에서 처리
    }
  };

  // 투표 취소
  const handleVoteCancel = async () => {
    try {
      await Promise.all(myVote.map(id => deleteVote(id)));
      setPreviousVote([]);
      setHasVoted(false);
      setMyVote([]);
    } catch {
       // 에러는 useDeleteVote onError에서 처리
    }
  };

  const displayCandidates = isRevote
    ? candidates.filter(c => c.voteCount === maxVote)
    : candidates;

  const sortedCandidates = [...displayCandidates].sort(
    (a, b) => b.voteCount - a.voteCount,
  );

  const buttonText = isRevoteTie
    ? '임의로 장소 확정하기'
    : isRevote
      ? '장소 확정하기'
      : isTie
        ? '다시 투표하기'
        : '장소 결정하기';

  const buttonDisabled = isRevote ? false : !hasVote;

  const handleConfirmClick = () => {
    if (isTie && !isRevote && !isRevoteTie) {
      setIsRevote(true);
    } else {
      const target = myVote.length > 0
        ? candidates.find(c => c.id === myVote[0])
        : topCandidates[0];
      setConfirmedCandidate(target ?? null);
      setIsConfirmModalOpen(true);
    }
  };

  // 모달에서 확정하기 누를 때 호출할 함수
  const handleConfirm = async (candidateId: number) => {
    try {
      await confirmPlace({ candidateId });
    } catch {}
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
    handleConfirm
  };
};