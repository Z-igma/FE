import BottomButton from '@/components/common/BottomButton';
import VoteConfirmModalIcon from '@/assets/images/voteConfirmModalIcon.svg';

interface CommonModalProps {
  questionText?: string;
  mainText: string;
  subText: string;
  closeText: string;
  confirmText: string;
  icon?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  mainTextSize?: string;
}

const CommonModal = ({
  questionText,
  mainText,
  subText,
  closeText,
  confirmText,
  icon,
  onConfirm,
  onClose,
  mainTextSize = 'text-[1.75rem]',
}: CommonModalProps) => {
  return (
    <div className="flex flex-col text-center w-81 gap-4.5 bg-[#FFFFFF] rounded-2xl py-7.5 px-4.5">
      <div className="flex flex-col gap-0.5">
        <div className="flex flex-col gap-1">
          {questionText && (
            <p className="text-[#111111] font-Pretendard font-medium text-[1rem] leading-6.4">
              {questionText}
            </p>
          )}
          <p
            className={`text-[#111111] font-Pretendard font-semibold ${mainTextSize} leading-11.2 truncate`}
          >
            {mainText}
          </p>
        </div>
        <div className="flex justify-center items-center gap-1">
          {icon && <img src={VoteConfirmModalIcon} />}
          <p className="text-[#888888] font-Pretendard font-regular text-[0.75rem] leading-4.2">
            {subText}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <BottomButton
          text={confirmText}
          textSize="1rem"
          onClick={onConfirm}
          py="py-2"
        />
        <div className="pt-2" onClick={onClose}>
          <p className="text-[#C6C6C6] font-Pretendard font-semibold text-[1rem] leading-5.6">
            {closeText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
