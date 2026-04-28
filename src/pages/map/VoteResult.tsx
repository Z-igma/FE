import { useLocation } from 'react-router-dom';
import BottomButton from '@/components/common/BottomButton';
import Header from '@/components/layout/Header';
import MemberIcon from '@/assets/images/memberIcon.svg';
import PromiseStatusBadge from '@/components/common/PromiseStatusBadge';

const VoteResult = () => {
  const { state } = useLocation();
  const promise = state?.promise; // 약속 정보

  return (
    <div>
      <Header title="장소 결정" />
      <div className="flex justify-between px-4 pt-3">
        <div className="flex flex-col gap-1">
          <p className="text-[#111111] font-Pretendard font-semibold text-[1.5rem] leading-8.4">
            {promise.title}
          </p>
          <div className="flex items-center gap-1.5">
            <img src={MemberIcon} className="w-4.5 h-4.5" />
            <p className="text-[#B2B2B2] font-Pretendard font-medium text-[0.875rem] leading-3.5">
              {promise.memberCount}명 참여
            </p>
          </div>
        </div>
        <div>
          <PromiseStatusBadge status={promise.planStatus} />
        </div>
        <div className="fixed bottom-30 px-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)]">
          <BottomButton text="장소 확정하기" />
        </div>
      </div>
    </div>
  );
};

export default VoteResult;
