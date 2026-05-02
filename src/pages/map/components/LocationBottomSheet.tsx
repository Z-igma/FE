import BottomSheet from '@/components/common/BottomSheet';
import MemberIcon from '@/assets/images/memberIcon.svg';
import PlusIcon from '@/assets/images/plusIcon.svg';
import NomineeCheckIcon from '@/assets/images/map/nomineeCheckIcon.svg';
import VoteIcon from '@/assets/images/map/voteIcon.svg';

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
}: LocationBottomSheetProps) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className="flex flex-col px-4.5 pt-6 gap-15"
      fullHeight="h-45"
      peekHeight="h-45"
    >
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
          <div className="flex gap-5">
            <div
              className={`w-9 h-9 p-1.5 rounded-full cursor-pointer ${isVoted ? 'bg-[#C6C6C6]' : 'bg-[#00408E]'}`}
              onClick={() => onToggleVote(!isVoted)}
            >
              <img src={VoteIcon} />
            </div>
            <div
              className={`w-9 h-9 p-1.5 rounded-full cursor-pointer ${isAdded ? 'bg-[#C6C6C6]' : 'bg-[#00408E]'}`}
              onClick={() => onToggleAdd(!isAdded)}
            >
              <img
                src={isAdded ? NomineeCheckIcon : PlusIcon}
                className="w-6 h-6"
              />
            </div>
          </div>
        </div>
        <p className="whitespace-pre-line text-[#111111] font-Pretendard font-regular text-[0.75rem] leading-4.5">
          {`📍 ${address}\n ⏰ \n💸`}
        </p>
      </div>
    </BottomSheet>
  );
};

export default LocationBottomSheet;
