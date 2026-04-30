import { useLocation } from 'react-router-dom';
import BottomButton from '@/components/common/BottomButton';
import Header from '@/components/layout/Header';
import CandidateVoteMemberIcon from '@/assets/images/candidateVoteMemberIcon.svg';
import PromiseStatusBadge from '@/components/common/PromiseStatusBadge';
import CandidatesCard from './components/CandidatesCard';

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
      isBest: true,
    },
    {
      id: 2,
      name: '스시 오마카세',
      distance: 340,
      address: '서울 강남 서초동 123-45',
      createMember: '지민',
      voteMember: '현준 예준',
      voteCount: 3,
      isBest: false,
    },
    {
      id: 3,
      name: '루프탑 바',
      distance: 340,
      address: '서울 홍대 입구역',
      createMember: '지민',
      voteMember: '',
      voteCount: 1,
      isBest: false,
    },
  ];

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const hasVote = totalVotes > 0;

  const maxVote = Math.max(...candidates.map(c => c.voteCount));
  const topCandidates = candidates.filter(c => c.voteCount === maxVote);
  const isTie = topCandidates.length > 1;

  const getStatus = (voteCount: number): 'best' | 'tie' | null => {
    if (voteCount !== maxVote) return null;
    if (isTie) return 'tie';
    return 'best';
  };

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
          <div className="fixed bottom-30 px-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)]">
            <BottomButton text="장소 확정하기" disabled={!hasVote} />
          </div>
        </div>
        <div className="flex flex-col overflow-y-auto max-h-[calc(100vh-260px)] px-4 gap-5 pb-20">
          {candidates.map(candidate => (
            <CandidatesCard
              key={candidate.id}
              status={getStatus(candidate.voteCount)}
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
