interface VoteStateBoxProps {
  isBest?: boolean;
  name: string;
  distance: string;
  vote: number;
}

const VoteStateBox = ({
  isBest = false,
  name,
  distance,
  vote,
}: VoteStateBoxProps) => {
  return (
    <div
      className={`${isBest ? 'bg-[#EDF1F6]' : 'bg-[#FFFFFF] border border-[#E0E0E0]'} pl-5 pr-6 py-3 rounded-[10px]`}
    >
      <div className="flex justify-between">
        <div className="flex flex-col gap-1.5">
          <p
            className={`${isBest ? 'text-[#111111]' : 'text-[#888888]'} font-Pretendard font-semibold text-[1.125rem] leading-6.3 truncate`}
          >
            {name}
          </p>
          <p
            className={`${isBest ? 'text-[#111111]' : 'text-[#888888]'} font-Pretendard font-regular text-[1rem] leading-5.6`}
          >
            {distance}m
          </p>
        </div>
        <p
          className={`${isBest ? 'text-[#111111]' : 'text-[#888888]'} font-Pretendard font-semibold text-[1.125rem] leading-6.3`}
        >
          {vote}표
        </p>
      </div>
    </div>
  );
};

export default VoteStateBox;
