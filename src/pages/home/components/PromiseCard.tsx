import CardPeopleIcon from '@/assets/images/home/cardPeopleIcon.svg';
import CardDetailButtonIcon from '@/assets/images/home/cardDetailButtonIcon.svg';
import MemberInvitePlusIcon from '@/assets/images/home/memberInvitePlusIcon.svg';
import PromiseStatusBadge from '@/components/common/PromiseStatusBadge';

interface PromiseCardProps {
  planStatus: string;
  title: string;
  date: string;
  memberCount: number;
  onClick?: () => void;
}

const PromiseCard = ({
  planStatus,
  title,
  date,
  memberCount,
  onClick,
}: PromiseCardProps) => {
  const isCompleted = planStatus === '확정 완료';

  return (
    <div
      className="flex flex-col w-full py-4 px-4.25 bg-[#FAFAFA] border border-[#E4E4E4] gap-3 rounded-xl"
      onClick={onClick}
    >
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="text-[#111111] font-Pretendard font-semibold text-[1.25rem] leading-7">
            {title}
          </p>
          <PromiseStatusBadge status={planStatus} />
        </div>
        <p className="text-[#B2B2B2] font-Pretendard font-regular text-[0.875rem] leading-5">
          {date}
        </p>
      </div>

      {!isCompleted &&
        (memberCount === 1 ? (
          <div className="flex items-center p-1.5 w-61 bg-[#EAF2FF] border border-[#C0D7FD] rounded-[10px]">
            <img src={MemberInvitePlusIcon} />
            <p className="text-[#00408E] font-Pretendard font-regular text-[0.75rem] leading-4.2">
              친구를 초대하기
            </p>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.25">
              <img src={CardPeopleIcon} />
              <p className="text-[#111111] font-Pretendard font-regular text-[0.875rem] leading-5">
                {memberCount}명
              </p>
            </div>
            <div className="w-7.5 h-7.5 flex items-center justify-center bg-[#E4E4E4] rounded-full">
              <img src={CardDetailButtonIcon} />
            </div>
          </div>
        ))}
    </div>
  );
};

export default PromiseCard;
