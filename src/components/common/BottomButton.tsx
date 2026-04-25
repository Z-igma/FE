interface BottomButtonProps {
  icon?: React.ReactNode;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

const BottomButton = ({
  icon,
  text,
  onClick,
  disabled = false,
}: BottomButtonProps) => {
  return (
    <div className="fixed bottom-30 px-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] cursor-pointer">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex py-4 gap-2 justify-center items-center rounded-[10px] ${disabled ? 'bg-[#E0E0E0] border border-[#C6C6C6]' : 'bg-[#00408E]'}`}
      >
        {icon}
        <p className="text-[#FFFFFF] font-Pretendard font-semibold text-[1.125rem] leading-6">
          {text}
        </p>
      </button>
    </div>
  );
};

export default BottomButton;
