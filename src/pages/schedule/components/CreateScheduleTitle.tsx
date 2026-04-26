interface CreateScheduleTitleProps {
  title: string;
  error?: boolean;
}

const CreateScheduleTitle = ({ title, error }: CreateScheduleTitleProps) => {
  return (
    <div>
      <p
        className={`font-Pretendard font-semibold text-[0.75rem] leading-3 ${error ? 'text-[#FF0909]' : 'text-[#111111]'}`}
      >
        {title} {error && <span>*</span>}
      </p>
    </div>
  );
};

export default CreateScheduleTitle;
