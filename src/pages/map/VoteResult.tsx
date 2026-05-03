import { useLocation, useNavigate } from 'react-router-dom';
import CandidatesCard from './components/CandidatesCard';
import CommonModal from '@/components/modal/CommonModal';
import BottomButton from '@/components/common/BottomButton';
import Header from '@/components/layout/Header';
import PromiseStatusBadge from '@/components/common/PromiseStatusBadge';
import { useVoteResult } from './hooks/useVoteResult';
import CandidateVoteMemberIcon from '@/assets/images/candidateVoteMemberIcon.svg';
import FixedBottomLayout from '@/components/layout/FixBottomLayout';

const VoteResult = () => {
  const isCreator = true; // 약속 생성자 구분 추가 예정

  const navigate = useNavigate();
  const { state } = useLocation();
  const promise = state?.promise;
  const markers = state?.markers ?? [];
  const votedPlaces: string[] = state?.votedPlaces ?? [];
  const votedPlace: string | null = state?.votedPlace ?? null;

  const {
    displayCandidates,
    myVote,
    setMyVote,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    confirmedCandidate,
    buttonText,
    buttonDisabled,
    getStatus,
    handleConfirmClick,
  } = useVoteResult({
    markers,
    votedPlaces,
    votedPlace,
    isMultipleVoting: promise?.isMultipleVoting ?? false,
  });

  return (
    <div className="flex flex-col gap-3">
      <Header title="장소 결정" />
      <div className="flex flex-col gap-5">
        <div className="flex justify-between px-4">
          <div className="flex flex-col gap-1">
            <p className="text-[#111111] font-Pretendard font-semibold text-[1.5rem] leading-8.4">
              {promise.title}
            </p>
            <div className="flex items-center gap-1.5">
              <img src={CandidateVoteMemberIcon} />
              <p className="text-[#B2B2B2] font-Pretendard font-medium text-[0.875rem] leading-3.5">
                {promise.memberCount}명 참여
              </p>
            </div>
          </div>
          <div>
            <PromiseStatusBadge status={promise.planStatus} />
          </div>

          {isCreator && (
            <FixedBottomLayout>
              <BottomButton
                text={buttonText}
                disabled={buttonDisabled}
                onClick={handleConfirmClick}
              />
            </FixedBottomLayout>
          )}
        </div>

        <div className="flex flex-col overflow-y-auto max-h-[calc(100vh-260px)] px-4 gap-5 pb-20">
          {displayCandidates.map(candidate => (
            <CandidatesCard
              key={candidate.id}
              status={getStatus(candidate.voteCount)}
              isSelectable={isCreator}
              isSelected={myVote === candidate.id}
              onSelect={() => setMyVote(candidate.id)}
              name={candidate.name}
              distance={candidate.distance}
              address={candidate.address}
              createMember={candidate.createMember}
              voteMember={candidate.voteMember}
              voteCount={candidate.voteCount}
              memberCount={promise.memberCount}
            />
          ))}
        </div>
      </div>

      {/* 확정 모달 */}
      {isConfirmModalOpen && confirmedCandidate && (
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
