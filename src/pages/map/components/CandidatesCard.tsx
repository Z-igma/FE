import type { CardStatus } from '@/types/map';
import CardMemberIcon from '@/assets/images/cardMemberIcon.svg';

interface CandidatesCardProps {
  isSelectable?: boolean; // 재투표 중 카드 선택 가능 여부
  isSelected?: boolean; // 현재 선택된 카드 여부
  onSelect?: () => void; // 카드 선택 핸들러
  status: CardStatus; // 투표 결과 상태 (1위 / 동점 / 기본)
  name: string;
  distance: number;
  address: string;
  createMember: string; // 후보지 등록한 멤버
  voteMember: string; // 투표한 멤버
  voteCount: number; // 득표 수
  memberCount: number; // 전체 멤버 수
  hideBadge?: boolean; // 배지 숨김 여부
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
  hideBadge,
}: CandidatesCardProps) => {
  return (
    <div
      className={`flex flex-col gap-1.5 pt-4.5 pb-5.5 px-5 rounded-2xl ${
        // 득표 상태 및 선택 여부에 따라 배경색 + 보더 적용
        status === 'best'
          ? `bg-[rgba(0,64,142,0.06)] ${isSelected ? 'border border-[#00408E]' : ''}`
          : status === 'tie'
            ? `bg-[rgba(255,152,0,0.10)] ${isSelected ? 'border border-[rgba(255,152,0,0.50)]' : ''}`
            : isSelected
              ? 'border border-[#00408E] bg-[rgba(0,64,142,0.06)]'
              : 'border border-[#C6C6C6]'
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

        {/* 1위 */}
        {status === 'best' && !hideBadge && (
          <div className="bg-[#E8F5E9] px-4 py-1.5 rounded-full">
            <p className="text-[#2E7D32] font-Pretendard font-semibold text-[0.75rem] leading-4.2">
              👑 1위
            </p>
          </div>
        )}

        {/* 동점 */}
        {status === 'tie' && !hideBadge && (
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

          {/* 투표 진행 바 */}
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
