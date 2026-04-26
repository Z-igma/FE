import CardPeopleIcon from '@/assets/images/home/cardPeopleIcon.svg';
import CardDetailButtonIcon from '@/assets/images/home/cardDetailButtonIcon.svg';

type ScheduleStatus = 'active' | 'pending' | 'completed';

interface ScheduleCardProps {
  status: ScheduleStatus;
  name: string;
  date: string;
  participantCount: number;
}

const STATUS_CONFIG = {
  active: {
    dot: 'bg-[#2E7D32]',
    badge: 'bg-[#E8F5E9] text-[#2E7D32]',
    label: '진행 중',
  },
  pending: {
    dot: 'bg-[#FFFFFF]',
    badge: 'bg-[#B2B2B2] text-[#FFFFFF]',
    label: '장소 미정',
  },
  completed: {
    dot: 'bg-[#FFFFFF]',
    badge: 'bg-[#646464] text-[#FFFFFF]',
    label: '확정 완료',
  },
};

const ScheduleCard = ({
  status,
  name,
  date,
  participantCount,
}: ScheduleCardProps) => {
  const config = STATUS_CONFIG[status];
  const isCompleted = status === 'completed';

  return (
    <div className="flex flex-col w-full py-4 px-4.25 bg-[#FAFAFA] border border-[#E4E4E4] gap-3 rounded-xl">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="text-[#111111] font-Pretendard font-semibold text-[1.25rem] leading-7">
            {name}
          </p>
          <div
            className={`flex items-center gap-1.5 py-1.5 px-1.75 rounded-full ${config.badge}`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
            <p className="font-Pretendard font-semibold text-[0.75rem] leading-4.2">
              {config.label}
            </p>
          </div>
        </div>
        <p className="text-[#B2B2B2] font-Pretendard font-regular text-[0.875rem] leading-5">
          {date}
        </p>
      </div>

      {!isCompleted && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.25">
            <img src={CardPeopleIcon} />
            <p className="text-[#111111] font-Pretendard font-regular text-[0.875rem] leading-5">
              {participantCount}명
            </p>
          </div>

          <div className="w-7.5 h-7.5 flex items-center justify-center bg-[#E4E4E4] rounded-full">
            <img src={CardDetailButtonIcon} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;
