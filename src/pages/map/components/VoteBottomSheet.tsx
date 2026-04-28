import BottomButton from '@/components/common/BottomButton';
import BottomSheet from '@/components/common/BottomSheet';
import { useNavigate } from 'react-router-dom';
import VoteStateBox from './VoteStateBox';

interface VoteBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
}

const VoteBottomSheet = ({ isOpen, onClose, count }: VoteBottomSheetProps) => {
  const navigate = useNavigate();

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      fullHeight="h-90"
      className="flex flex-col gap-5 pt-2 px-5 h-full"
    >
      <p className="text-[#111111] font-Pretendard font-semibold text-[1.375rem] leading-7.7">
        투표 중인 장소 {count}곳
      </p>
      <div className="flex flex-col overflow-y-auto min-h-45 max-h-45 gap-2.5">
        {/* 투표 내용 임시 */}
        <VoteStateBox
          isBest={true}
          name="이태원 파스타 집"
          distance="120m"
          vote={4}
        />
        <VoteStateBox name="이태원 파스타 집" distance="120m" vote={1} />
      </div>
      <BottomButton
        text="장소 결정하기"
        textSize="1rem"
        onClick={() => navigate('/map/${promise.id}/vote')}
      />
    </BottomSheet>
  );
};

export default VoteBottomSheet;
