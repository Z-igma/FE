import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CandidatesCard from './components/CandidatesCard';
import CommonModal from '@/components/modal/CommonModal';
import PromiseStatusBadge from '@/components/common/PromiseStatusBadge';
import Header from '@/components/layout/Header';

const ConfirmedResult = () => {
  const { state } = useLocation();
  const promise = state?.promise;
  const candidate = state?.confirmedCandidate;

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Header title="일정 확정" />
      <div className="flex flex-col gap-5">
        <div className="flex justify-between px-4">
          <div className="flex flex-col gap-1">
            <p className="text-[#111111] font-Pretendard font-semibold text-[1.5rem] leading-8.4">
              {promise.title}
            </p>
          </div>
          <div>
            <PromiseStatusBadge status="확정 완료" />
          </div>
        </div>
        <div className="px-4">
          <CandidatesCard
            status="best"
            hideBadge
            name={candidate.name}
            distance={candidate.distance}
            address={candidate.address}
            createMember={candidate.createMember}
            voteMember={candidate.voteMember}
            voteCount={candidate.voteCount}
            memberCount={promise.memberCount}
          />
        </div>
        <div className="fixed bottom-25 pb-6 px-4 flex gap-4 w-full">
          <button
            className="flex-1 py-4 border border-[#C6C6C6] rounded-[10px] bg-[#FFFFFF] active:bg-[#00408E]"
            onClick={() => setIsCalendarModalOpen(true)}
          >
            <p className="text-[#111111] font-Pretendard font-normal text-[1rem] leading-4 active:text-[#FFFFFF]">
              캘린더 저장
            </p>
          </button>
          <button
            className="flex-1 py-4 border border-[#C6C6C6] rounded-[10px] bg-[#FFFFFF] active:bg-[#00408E]"
            onClick={() => setIsCalendarModalOpen(true)}
          >
            <p className="text-[#111111] font-Pretendard font-normal text-[1rem] leading-4 active:text-[#FFFFFF]">
              캘린더 저장
            </p>
          </button>
        </div>
      </div>

      {isCalendarModalOpen && (
        <div className="fixed inset-0 bg-[rgba(17,17,17,0.40)] backdrop-blur-sm flex items-center justify-center z-50">
          <CommonModal
            mainText="캘린더 접근 권한이 필요합니다"
            mainTextSize="1.25rem"
            subText="약속을 캘린더에 저장하려면 설정에서 권한을 허용해 주세요"
            confirmText="설정 열기"
            closeText="취소"
            onConfirm={() => {
              setIsCalendarModalOpen(true);
            }}
            onClose={() => setIsCalendarModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ConfirmedResult;
