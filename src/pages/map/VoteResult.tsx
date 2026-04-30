import { useLocation } from 'react-router-dom';
import BottomButton from '@/components/common/BottomButton';
import Header from '@/components/layout/Header';
import CandidateVoteMemberIcon from '@/assets/images/candidateVoteMemberIcon.svg';
import PromiseStatusBadge from '@/components/common/PromiseStatusBadge';
import CandidatesCard from './components/CandidatesCard';
import { useState } from 'react';

const VoteResult = () => {
  // 약속 생성자 구분 추가 예정

  const { state } = useLocation();
  const promise = state?.promise; // 약속 정보

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

  // 모든 후보 장소의 총 투표 수를 계산 후 버튼 활성화 여부
  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const hasVote = totalVotes > 0;
  const maxVote = Math.max(...candidates.map(c => c.voteCount));

  // 최다 득표 수 판단
  const topCandidates = candidates.filter(c => c.voteCount === maxVote);
  const isTie = topCandidates.length > 1;

  // 각 약속별 투표 상태
  const getStatus = (voteCount: number): 'best' | 'tie' | null => {
    if (voteCount !== maxVote) return null;
    if (isTie) return 'tie';
    return 'best';
  };

  const isCreator = true; // 확정 가능 여부 분기 위한 생성자 여부 임시 판단
  const [isRevote, setIsRevote] = useState(false); // 재투표 상태

  // 재투표 후보지
  const revoteCandidates = candidates.filter(c => c.voteCount === maxVote);
  const displayCandidates = isRevote ? revoteCandidates : candidates;

  const isRevoteTie = false; // 재투표 후 또 동점 여부
  const [myVote, setMyVote] = useState<number | null>(null);
  const [pickedId, setPickedId] = useState<number | null>(null); // 방장이 선택한 후보지

  const isSelectable = isRevote || (isRevoteTie && isCreator);

  const getCardStatus = (candidate: (typeof candidates)[0]) => {
    return getStatus(candidate.voteCount);
  };

  const buttonText = isRevote
    ? '투표하기'
    : isTie && !isRevoteTie
      ? '다시 투표하기'
      : '장소 확정하기';

  // 버튼 비활성화 조건
  const buttonDisabled = isRevote
    ? myVote === null
    : isRevoteTie
      ? pickedId === null
      : !hasVote;

  return (
    <div className="flex flex-col gap-3">
      <Header title="장소 결정" />
      <div className="flex flex-col gap-5">
        <div className="flex justify-between px-4 ">
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

          {(isCreator || isRevote) && (
            <div className="fixed bottom-30 px-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)]">
              <BottomButton
                text={buttonText}
                disabled={buttonDisabled}
                onClick={() => {
                  if (isTie && !isRevote && !isRevoteTie) {
                    setIsRevote(true); // 재투표 시작
                  }
                }}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col overflow-y-auto max-h-[calc(100vh-260px)] px-4 gap-5 pb-20">
          {displayCandidates.map(candidate => (
            <CandidatesCard
              status={getCardStatus(candidate)}
              isSelectable={isSelectable}
              isSelected={
                isRevote ? myVote === candidate.id : pickedId === candidate.id
              }
              onSelect={() => {
                if (isRevote) setMyVote(candidate.id);
                else if (isRevoteTie && isCreator) setPickedId(candidate.id);
              }}
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
    </div>
  );
};

export default VoteResult;
