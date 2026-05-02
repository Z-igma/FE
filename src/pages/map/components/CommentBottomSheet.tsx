import { useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import SendIcon from '@/assets/images/map/sendIcon.svg';
import CommentCloseIcon from '@/assets/images/map/commentCloseIcon.svg';

interface CommentBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  latLng?: { lat: number; lng: number } | null;
  onSubmit?: (text: string, latLng: { lat: number; lng: number }) => void;
}

const CommentBottomSheet = ({
  isOpen,
  onClose,
  latLng,
  onSubmit,
}: CommentBottomSheetProps) => {
  const [text, setText] = useState('');

  const handleFocus = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!text.trim() || !latLng) return;
    onSubmit?.(text.trim(), latLng);
    setText('');
    onClose();
  };

  return (
    <>
      <div
        className="fixed top-5 left-5 px-3.5 py-3.5 bg-[#B2B2B2] rounded-full z-60 cursor-pointer"
        onClick={onClose}
      >
        <img src={CommentCloseIcon} />
      </div>
      <div className="fixed inset-x-0 top-0 bottom-24 bg-[rgba(17,17,17,0.40)] backdrop-blur-sm flex items-center justify-center z-50" />
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        className="flex flex-col items-end px-5 gap-1.5"
        peekHeight="h-31"
        fullHeight="h-31"
      >
        <input
          onFocus={handleFocus}
          placeholder="댓글 추가"
          className="w-full px-5 py-4 bg-[#EDF1F6] rounded-[10px] placeholder:text-[#C6C6C6] text-[#111111] text-base font-Pretendard font-medium leading-5 focus:outline-none"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div
          className={`flex justify-center items-center w-8 h-8 rounded-full transition-colors ${text.trim() && latLng ? 'bg-[#00408E] cursor-pointer' : 'bg-[#DDDDDD]'}`}
          onClick={handleSend}
        >
          <img src={SendIcon} />
        </div>
      </BottomSheet>
    </>
  );
};

export default CommentBottomSheet;
