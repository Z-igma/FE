interface CreateScheduleTitleProps {
  title: string;
}

const CreateScheduleTitle = ({ title }: CreateScheduleTitleProps) => {
  return (
    <div className="">
      <p className="text-[#111111] font-[Pretendard] font-semibold text-[0.75rem] leading-3">
        {title}
      </p>
    </div>
  );
};

export default CreateScheduleTitle;
