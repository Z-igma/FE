import CardMemberIcon from '@/assets/images/cardMemberIcon.svg';

interface CandidatesCardProps {
  isBest: boolean;
  name: string;
  distance: number;
  address: string;
  createMember: string;
  voteMember: string;
  voteCount: number;
  memberCount: number;
}

const CandidatesCard = ({
  isBest,
  name,
  distance,
  address,
  createMember,
  voteMember,
  voteCount,
  memberCount,
}: CandidatesCardProps) => {
  return (
    <div
      className={`flex flex-col gap-1.5 pt-4.5 pb-5.5 px-5 rounded-2xl ${
        isBest ? 'bg-[rgba(0,64,142,0.06)]' : 'bg-white border border-[#C6C6C6]'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-[#111111] font-Pretendard font-semibold text-[1.25rem] leading-7">
            {name}
          </p>
          <p className="text-[#111111] font-Pretendard font-regular text-[0.75rem] leading-4.5">
            📍 {distance}m {address}
          </p>
        </div>
        {isBest && (
          <div className="bg-[#E8F5E9] px-4 py-1.5 rounded-full">
            <p className="text-[#2E7D32] font-Pretendard font-semibold text-[0.75rem] leading-4.2">
              👑 1위
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col items-end gap-4">
          <p className="text-[#00408E] font-Pretendard font-bold text-[1.25rem] leading-7">
            {voteCount} / {memberCount} 표
          </p>
          <div className="w-full h-1.5 bg-[#DDDDDD] rounded-full">
            <div
              className="h-1.5 bg-[#00408E] rounded-full"
              style={{
                width: `${memberCount > 0 ? (voteCount / memberCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <img src={CardMemberIcon} />
          <p className="text-[#111111] font-Pretendard font-regular text-[0.875rem] leading-3.5">
            <span className="text-[#00408E] font-bold">{createMember} </span>
            {voteMember}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidatesCard;
