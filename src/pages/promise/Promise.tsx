import { useNavigate } from 'react-router-dom';
import PromiseCard from '@/pages/home/components/PromiseCard';
import NonePromiseIcon from '@/assets/images/home/nonePromiseIcon.svg';

const Promise = () => {
  const navigate = useNavigate();

  const promises = [
    {
      id: 1,
      title: '저녁 모임',
      planStatus: '진행 중',
      promisedAt: '2026-05-28T21:26:12',
      dayOfWeek: '목',
      memberCount: 3,
    },
  ];

  const now = new Date();

  const upcomingConfirmedPromises = promises.filter(
    promise =>
      promise.planStatus === '확정 완료' && new Date(promise.promisedAt) >= now,
  );

  const formatDate = (promisedAt: string, dayOfWeek: string) => {
    const date = new Date(promisedAt);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const time = promisedAt.split('T')[1].slice(0, 5);
    return `${month}월 ${day}일 (${dayOfWeek}) ${time}`;
  };

  return upcomingConfirmedPromises.length > 0 ? (
    <div className="flex flex-col pt-10 px-4 gap-5">
      <div className="flex flex-col gap-2.75">
        <p className="text-[#111111] font-Pretendard font-semibold text-[1.75rem] leading-10">
          예정된 약속
        </p>
        <p className="text-[#111111] font-Pretendard font-light text-[1rem] leading-5.6">
          확정된 약속 장소를 확인해 보세요
        </p>
      </div>
      <div className="flex flex-col gap-5">
        {upcomingConfirmedPromises.map(promise => (
          <PromiseCard
            key={promise.id}
            planStatus={promise.planStatus}
            title={promise.title}
            date={formatDate(promise.promisedAt, promise.dayOfWeek)}
            memberCount={promise.memberCount}
            onClick={() =>
              navigate(`/map/${promise.id}/confirmed`, { state: { promise } })
            }
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <img src={NonePromiseIcon} />
      <div className="flex flex-col text-center gap-1">
        <p className="text-[#111111] font-Pretendard font-semibold text-[1rem] leading-5.6">
          확정된 약속이 없어요
        </p>
        <p className="text-[#B2B2B2] font-Pretendard font-normal text-[1rem] leading-5.6">
          약속을 확정하면 여기서 확인할 수 있어요
        </p>
      </div>
    </div>
  );
};

export default Promise;
