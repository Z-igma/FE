import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CandidatesCard from './components/CandidatesCard';
import CommonModal from '@/components/modal/CommonModal';
import PromiseStatusBadge from '@/components/common/PromiseStatusBadge';
import Header from '@/components/layout/Header';
import { usePromiseDetail } from './services/usePromiseDetail';
import { useGetCandidatePlaces } from './services/useVotePalce';

const ConfirmedResult = () => {
  const { promiseId } = useParams();
  const parsedPromiseId = Number(promiseId);
  const { data: promise } = usePromiseDetail(parsedPromiseId);
  const { data: candidatePlacesResponse } = useGetCandidatePlaces(promiseId);
  const candidate = candidatePlacesResponse?.data.candidates.find(c => c.isConfirmed);

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  if (!promise || !candidate) return null;

  const today = new Date().toDateString() === new Date(promise.promisedAt).toDateString();
  const time = new Date(promise.promisedAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="flex flex-col gap-3">
      <Header title="일정 확정" />
      <div className="flex flex-col gap-5">
        {!today ? (
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
        ) : (
          <div className="px-4">
            <div className="flex justify-between py-4 px-5 bg-[#00408E] rounded-xl">
              <p className="text-[#FFFFFF] font-Pretendard font-semibold text-[1.25rem] leading-5">
                오늘의 약속
              </p>
              <div className="flex flex-col items-end gap-1">
                <p className="text-[#FFFFFF] font-Pretendard font-regular text-[1rem] leading-4">
                  {promise.dayOfWeek}요일 {promise.title}
                </p>
                <p className="text-[#FFFFFF] font-Pretendard font-regular text-[1rem] leading-4">
                  {time}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="px-4">
          <CandidatesCard
            status="best"
            hideBadge
            name={candidate.name}
            distance={candidate.distance}
            address={candidate.address}
            createMember={candidate.voteInfo.creator.nickname}
            voteMember={candidate.voteInfo.voters
              .filter(v => v.userId !== candidate.voteInfo.creator.userId)
              .map(v => v.nickname)
              .join(', ')}
            voteCount={candidate.voteInfo.voteCount}
            memberCount={promise.memberCount}
          />
        </div>

        <div className="fixed bottom-25 pb-6 px-4 flex gap-4 w-full">
          {!today ? (
            <button
              className="flex-1 py-4 border border-[#C6C6C6] rounded-[10px] bg-[#FFFFFF] active:bg-[#00408E]"
              onClick={() => setIsCalendarModalOpen(true)}
            >
              <p className="text-[#111111] font-Pretendard font-normal text-[1rem] leading-4 active:text-[#FFFFFF]">
                캘린더 저장
              </p>
            </button>
          ) : (
            <button
              className="flex-1 py-4 border border-[#C6C6C6] rounded-[10px] bg-[#FFFFFF] active:bg-[#00408E]"
            >
              <p className="text-[#111111] font-Pretendard font-normal text-[1rem] leading-4 active:text-[#FFFFFF]">
                예약 확인
              </p>
            </button>
          )}

          <button
            className="flex-1 py-4 border border-[#C6C6C6] rounded-[10px] bg-[#FFFFFF] active:bg-[#00408E]"
          >
            <p className="text-[#111111] font-Pretendard font-normal text-[1rem] leading-4 active:text-[#FFFFFF]">
              길찾기
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
            onConfirm={() => setIsCalendarModalOpen(true)}
            onClose={() => setIsCalendarModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ConfirmedResult;