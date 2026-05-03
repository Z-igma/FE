import BottomSheet from '@/components/common/BottomSheet';
import MemberIcon from '@/assets/images/memberIcon.svg';
import PlusIcon from '@/assets/images/plusIcon.svg';
import NomineeMinusIcon from '@/assets/images/map/nomineeMinusIcon.svg';
import VoteIcon from '@/assets/images/map/voteIcon.svg';
import WarningIcon from '@/assets/images/warningIcon.svg';

interface LocationBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  placeName: string;
  address: string;
  proposedBy: string;
  isAdded: boolean;
  onToggleAdd: (isAdded: boolean) => void;
  isVoted: boolean;
  onToggleVote: (isVoted: boolean) => void;
  isConfirmed: boolean;
}

const LocationBottomSheet = ({
  isOpen,
  onClose,
  placeName,
  address,
  proposedBy,
  isAdded,
  onToggleAdd,
  isVoted,
  onToggleVote,
  isConfirmed,
}: LocationBottomSheetProps) => {
  const isError = placeName === '선택한 위치';

  const height = isError ? 'h-60' : isConfirmed ? 'h-60' : 'h-45';

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className="flex flex-col px-4.5 pt-6 gap-15"
      fullHeight={height}
      peekHeight={height}
    >
      {/* 에러 상태 */}
      {isError ? (
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="flex flex-col items-center justify-center">
            <img src={WarningIcon} className="w-18 h-18" />
            <div className="flex flex-col items-center gap-1">
              <p className="text-[#111111] font-Pretendard font-semibold text-[0.875rem] leading-5">
                정보를 불러오지 못했어요
              </p>
              <p className="text-[#888888] font-Pretendard font-medium text-[0.75rem] leading-4.5">
                다시 시도해 주세요
              </p>
            </div>
          </div>
          <button
            className="w-full py-3 bg-[#C6C6C6] rounded-[10px]"
            onClick={onClose}
          >
            <p className="text-[#FFFFFF] font-Pretendard font-semibold text-[1rem]">
              다시 시도하기
            </p>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="flex flex-col gap-0.5">
              <p className="text-[#111111] font-Pretendard font-semibold text-[1.375rem] leading-7.7">
                {placeName}
              </p>
              <div className="flex gap-0.5 items-center">
                <img src={MemberIcon} />
                <p className="text-[#888888] font-Pretendard font-medium text-[0.75rem] leading-4.2">
                  <span className="font-semibold">{proposedBy}</span> 님이 제안
                </p>
              </div>
            </div>

            {isConfirmed ? (
              <div className="px-3 py-1.5 bg-[#E8F5E9] rounded-full self-start">
                <p className="text-[#2E7D32] font-Pretendard font-semibold text-[0.75rem] leading-4.2">
                  확정된 장소
                </p>
              </div>
            ) : (
              <div className="flex gap-5">
                <div
                  className={`w-9 h-9 p-1.5 rounded-full ${
                    !isAdded ? 'opacity-30' : 'cursor-pointer'
                  } ${isVoted ? 'bg-[#C6C6C6]' : 'bg-[#00408E]'}`}
                  onClick={() => isAdded && onToggleVote(!isVoted)}
                >
                  <img src={VoteIcon} />
                </div>
                <div
                  className={`w-9 h-9 p-1.5 rounded-full cursor-pointer ${isAdded ? 'bg-[#D40004]' : 'bg-[#00408E]'}`}
                  onClick={() => onToggleAdd(!isAdded)}
                >
                  <img
                    src={isAdded ? NomineeMinusIcon : PlusIcon}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            )}
          </div>

          <p className="whitespace-pre-line text-[#111111] font-Pretendard font-regular text-[0.75rem] leading-4.5">
            {`📍 ${address}\n ⏰ \n💸`}
          </p>

          {/* 확정 시 하단 안내 문구 */}
          {isConfirmed && (
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center justify-center py-1 w-50 bg-[rgba(232,245,233,0.40)] rounded-[10px] border border-[#E8F5E9]">
                <p className="text-[#2E7D32] text-center font-Pretendard font-medium text-[0.6875rem] leading-4 whitespace-pre-line">
                  {`장소가 확정됐어요\n투표가 종료되었습니다`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  );
};

export default LocationBottomSheet;
