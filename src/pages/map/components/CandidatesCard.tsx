import CardMemberIcon from '@/assets/images/cardMemberIcon.svg';

type CardStatus = 'best' | 'tie' | null;

interface CandidatesCardProps {
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  status: CardStatus;
  name: string;
  distance: number;
  address: string;
  createMember: string;
  voteMember: string;
  voteCount: number;
  memberCount: number;
}

const CandidatesCard = ({
  isSelectable,
  isSelected,
  onSelect,
  status,
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
      className={`flex flex-col gap-1.5 pt-4.5 pb-5.5 px-5 border rounded-2xl ${
        isSelectable && isSelected
          ? 'bg-[rgba(255,152,0,0.10)] border-[#FF9800]'
          : isSelectable
            ? 'bg-[#FFFFFF] border-[#C6C6C6]'
            : status === 'best'
              ? 'bg-[rgba(0,64,142,0.06)] border-[#00408E]'
              : status === 'tie'
                ? 'bg-[rgba(255,152,0,0.10)] border-[rgba(255,152,0,0.50)]'
                : 'border-[#C6C6C6]'
      } ${isSelectable ? 'cursor-pointer' : ''}`}
      onClick={isSelectable ? onSelect : undefined}
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
        {status === 'best' && (
          <div className="bg-[#E8F5E9] px-4 py-1.5 rounded-full">
            <p className="text-[#2E7D32] font-Pretendard font-semibold text-[0.75rem] leading-4.2">
              👑 1위
            </p>
          </div>
        )}
        {status === 'tie' && (
          <div className="bg-[#FF9800] px-4 py-1.5 rounded-full">
            <p className="text-[#FFFFFF] font-Pretendard font-semibold text-[0.75rem] leading-4.2">
              동점
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col items-end gap-4">
          <p
            className={`font-Pretendard font-bold text-[1.25rem] leading-7 ${
              status === 'tie' ? 'text-[#FFB240]' : 'text-[#00408E]'
            }`}
          >
            {voteCount} / {memberCount} 표
          </p>
          <div className="w-full h-1.5 bg-[#DDDDDD] rounded-full">
            <div
              className={`h-1.5 rounded-full ${
                status === 'tie' ? 'bg-[#FFB240]' : 'bg-[#00408E]'
              }`}
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
