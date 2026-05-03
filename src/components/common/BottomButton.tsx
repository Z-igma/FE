interface BottomButtonProps {
  icon?: React.ReactNode;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  py?: string;
  textSize?: string;
}

const BottomButton = ({
  icon,
  text,
  onClick,
  disabled = false,
  py = 'py-4',
  textSize = 'text-[1.125rem]',
}: BottomButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex ${py} gap-2 justify-center items-center rounded-[10px] ${disabled ? 'bg-[#E0E0E0] border border-[#C6C6C6]' : 'bg-[#00408E]'}`}
    >
      {icon}
      <p
        className={`text-[#FFFFFF] font-Pretendard font-semibold ${textSize} leading-6`}
      >
        {text}
      </p>
    </button>
  );
};

export default BottomButton;
