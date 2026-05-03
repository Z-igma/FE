import WarningIcon from '@/assets/images/warningIcon.svg';

interface ToastMessageProps {
  title: string;
  subTitle: string;
}

const ToastMessage = ({ title, subTitle }: ToastMessageProps) => {
  return (
    <div className="flex flex-col items-center text-center justify-center w-50 h-30 mb-[-1] bg-[#FFFFFF] rounded-2xl">
      <img src={WarningIcon} className="w-12.5 h-12.5" />
      <div className="flex flex-col">
        <p className="text-[#111111] font-Pretendard font-semibold text-[1rem] leading-6.4">
          {title}
        </p>
        <p className="text-[#111111] font-Pretendard font-light text-[0.75rem] leading-4.8">
          {subTitle}
        </p>
      </div>
    </div>
  );
};

export default ToastMessage;
