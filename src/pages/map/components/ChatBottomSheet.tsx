import BottomSheet from '@/components/common/BottomSheet';
import SendIcon from '@/assets/images/map/sendIcon.svg';

interface ChatBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBottomSheet = ({ isOpen, onClose }: ChatBottomSheetProps) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className="flex flex-col items-end px-5 gap-1.5"
      peekHeight="h-31"
    >
      <input
        placeholder="댓글 추가"
        className="w-full px-5 py-4 bg-[#EDF1F6] rounded-[10px] placeholder:text-[#C6C6C6] text-[#111111] text-[0.875rem] font-Pretendard font-medium leading-5 focus:outline-none"
      />
      <div className="flex justify-center items-center w-8 h-8 bg-[#DDDDDD] rounded-full">
        <img src={SendIcon} />
      </div>
    </BottomSheet>
  );
};

export default ChatBottomSheet;
