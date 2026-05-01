import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CandidatesCard from './components/CandidatesCard';
import CommonModal from '@/components/modal/CommonModal';
import BottomButton from '@/components/common/BottomButton';
import Header from '@/components/layout/Header';
import PromiseStatusBadge from '@/components/common/PromiseStatusBadge';
import CandidateVoteMemberIcon from '@/assets/images/candidateVoteMemberIcon.svg';

const VoteResult = () => {
  const candidates = [
    {
      id: 1,
      name: '이태원 파스타 집',
      distance: 120,
      address: '서울 마포구 홍대입구',
      createMember: '수아',
      voteMember: '지민 현우 민준',
      voteCount: 3,
    },
    {
      id: 2,
      name: '스시 오마카세',
      distance: 340,
      address: '서울 강남 서초동 123-45',
      createMember: '지민',
      voteMember: '현준 예준',
      voteCount: 1,
    },
    {
      id: 3,
      name: '루프탑 바',
      distance: 340,
      address: '서울 홍대 입구역',
      createMember: '지민',
      voteMember: '',
      voteCount: 1,
    },
  ];

  const isCreator = true; // 약속 생성자 구분 추가 예정

  const navigate = useNavigate();
  const { state } = useLocation();
  const promise = state?.promise;

  // 투표 결과 계산
  const hasVote = candidates.some(c => c.voteCount > 0); // 투표가 하나라도 있는지
  const maxVote = Math.max(...candidates.map(c => c.voteCount)); // 최다 득표 수
  const topCandidates = candidates.filter(c => c.voteCount === maxVote); // 최다 득표 후보지 목록
  const isTie = topCandidates.length > 1; // 동점 여부

  // 득표 수에 따른 카드 상태 반환
  const getStatus = (voteCount: number): 'best' | 'tie' | null => {
    if (voteCount !== maxVote) return null;
    return isTie ? 'tie' : 'best';
  };

  const [isRevote, setIsRevote] = useState(false); // 재투표 진행 여부
  const isRevoteTie = false; // 재투표 후 동점 여부
  const [myVote, setMyVote] = useState<number | null>(null); // 방장이 선택한 후보지

  // 재투표 시 동점 후보지만 표시, 아니면 전체 표시
  const displayCandidates = isRevote
    ? candidates.filter(c => c.voteCount === maxVote)
    : candidates;

  // 현재 상태에 따른 버튼 텍스트
  const buttonText = isRevoteTie
    ? '임의로 장소 확정하기' // 재투표 후 또 동점 시 방장이 임의 확정
    : isRevote
      ? '장소 확정하기' // 재투표 중
      : isTie
        ? '다시 투표하기' // 첫 투표 동점
        : '장소 결정하기'; // 일반

  // 재투표 중엔 후보지 선택을 하면 항상 활성화지만 디폴트는 투표를 시작하면 활성화
  const buttonDisabled = isRevote ? myVote === null : !hasVote;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmedCandidate, setConfirmedCandidate] = useState<
    (typeof candidates)[0] | null
  >(null); // 확정 모달에 넘길 후보지

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
            <div className="fixed bottom-30 px-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)]">
              <BottomButton
                text={buttonText}
                disabled={buttonDisabled}
                onClick={() => {
                  if (isTie && !isRevote && !isRevoteTie) {
                    // 동점이면 재투표 시작
                    setIsRevote(true);
                  } else {
                    // 확정 모달 오픈
                    const target = myVote
                      ? candidates.find(c => c.id === myVote)
                      : topCandidates[0];
                    setConfirmedCandidate(target ?? null);
                    setIsConfirmModalOpen(true);
                  }
                }}
              />
            </div>
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
