import { useLocation, useNavigate } from 'react-router-dom';
import CandidatesCard from './components/CandidatesCard';
import CommonModal from '@/components/modal/CommonModal';
import BottomButton from '@/components/common/BottomButton';
import Header from '@/components/layout/Header';
import PromiseStatusBadge from '@/components/common/PromiseStatusBadge';
import { useVoteResult } from './hooks/useVoteResult';
import FixBottomLayout from '@/components/layout/FixBottomLayout';
import CandidateVoteMemberIcon from '@/assets/images/candidateVoteMemberIcon.svg';
import RevoteMessageIcon from '@/assets/images/revoteMessageIcon.svg';

const VoteResult = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const promise = state?.promise;
  const markers = state?.candidatesPlaces ?? [];
  const votedPlaces: string[] = state?.votedPlaces ?? [];
  const votedPlace: string | null = state?.votedPlace ?? null;
  const isCreator = promise?.isLeader ?? false;

  const {
    sortedCandidates,
    myVote,
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
  } = useVoteResult({
    markers,
    votedPlaces,
    votedPlace,
    isMultipleVoting: promise?.isMultipleVoting ?? true,
  });

  return (
    <div className="flex flex-col gap-3">
      <Header title="장소 결정" />
      <div className="flex flex-col gap-5">
        <div className="flex justify-between px-4">
          <div className="flex flex-col gap-1">
            <p className="text-[#111111] font-Pretendard font-semibold text-[1.5rem] leading-8.4">
              {promise?.title}
            </p>
            <div className="flex items-center gap-1.5">
              <img src={CandidateVoteMemberIcon} />
              <p className="text-[#B2B2B2] font-Pretendard font-medium text-[0.875rem] leading-3.5">
                {promise?.memberCount}명 참여
              </p>
            </div>
          </div>
          <div>
            <PromiseStatusBadge status={promise?.promiseStatus} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {isTie && (
            <div className="flex items-center gap-1 px-4">
              <img src={RevoteMessageIcon} />
              <p className="text-[#FF9800] font-Pretendard font-regular text-[0.75rem] leading-4.2">
                동점 시 재투표를 진행해 주세요
              </p>
            </div>
          )}
          <div className="flex flex-col overflow-y-auto max-h-[calc(100vh-260px)] px-4 gap-5 pb-20">
            {sortedCandidates.map(candidate => (
              <CandidatesCard
                key={candidate.id}
                status={getStatus(candidate.voteCount)}
                isSelectable={true}
                isSelected={myVote.includes(candidate.id)}
                onSelect={() => handleSelect(candidate.id)}
                name={candidate.name}
                distance={candidate.distance}
                address={candidate.address}
                createMember={candidate.createMember}
                voteMember={candidate.voteMember}
                voteCount={candidate.voteCount}
                memberCount={promise?.memberCount}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 방장은 확정 버튼 / 참여자는 투표 버튼 */}
      <FixBottomLayout>
        {isCreator ? (
          <BottomButton
            text={buttonText}
            disabled={buttonDisabled}
            onClick={handleConfirmClick}
          />
        ) : (
          <BottomButton
            text={hasVoted ? '다시 투표하기' : '투표하기'}
            disabled={!hasVoted && myVote.length === 0}
            onClick={hasVoted ? handleVoteCancel : handleVoteSubmit}
          />
        )}
      </FixBottomLayout>

      {/* 확정 모달  */}
      {isCreator && isConfirmModalOpen && confirmedCandidate && (
        <div className="fixed inset-0 bg-[rgba(17,17,17,0.40)] backdrop-blur-sm flex items-center justify-center z-50">
          <CommonModal
            questionText="이 장소를 확정할까요?"
            mainText={confirmedCandidate.name}
            subText="확정 시 모든 멤버에게 알림이 전송됩니다"
            onConfirm={() => {
              setIsConfirmModalOpen(false);
              navigate(`/map/${promise.id}/confirmed`, {
                state: { promise, confirmedCandidate },
              });
            }}
            onClose={() => setIsConfirmModalOpen(false)}
            confirmText="확정하기"
            closeText="취소"
            icon={true}
          />
        </div>
      )}
    </div>
  );
};

export default VoteResult;
