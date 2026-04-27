import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import PromiseCard from './components/PromiseCard';
import BottomButton from '@/components/common/BottomButton';
import NonePromiseIcon from '@/assets/images/home/nonePromiseIcon.svg';
import PlusIcon from '@/assets/images/plusIcon.svg';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const promises = [
    {
      id: 1,
      title: '저녁 모임',
      planStatus: '진행 중',
      promisedAt: '2026-05-28T21:26:12',
      dayOfWeek: '목',
      memberCount: 3,
    },
    {
      id: 2,
      title: '영화',
      planStatus: '확정 완료',
      promisedAt: '2026-04-25T21:26:12',
      dayOfWeek: '토',
      memberCount: 1,
    },
  ];
  const hasPromise = promises.length > 0;

  const now = new Date();

  const activePromises = promises.filter(
    promise => new Date(promise.promisedAt) >= now,
  );

  const pastPromises = promises.filter(
    promise => new Date(promise.promisedAt) < now,
  );

  const formatDate = (promisedAt: string, dayOfWeek: string) => {
    const date = new Date(promisedAt);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const time = promisedAt.split('T')[1].slice(0, 5);
    return `${month}월 ${day}일 (${dayOfWeek}) ${time}`;
  };

  const handleBottomButton = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/promise/create');
    }
  };

  return isLoggedIn && hasPromise ? (
    <div className="flex flex-col pt-10 px-4 gap-5">
      <div className="flex flex-col gap-2.75">
        <p className="text-[#111111] font-Pretendard font-semibold text-[1.75rem] whitespace-pre-line leading-10">
          {`약속 장소\n친구들과 함께 정해요`}
        </p>
        <p className="text-[#111111] font-Pretendard font-light text-[1rem] leading-5.6">
          지도를 보며 투표로 장소를 정해 보세요
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[#B2B2B2] font-Pretendard font-semibold text-[0.75rem] leading-4.2">
          진행 중인 약속 {activePromises.length}
        </p>
        <div className="flex flex-col gap-5">
          {activePromises.map(promise => (
            <PromiseCard
              key={promise.id}
              planStatus={promise.planStatus}
              title={promise.title}
              date={formatDate(promise.promisedAt, promise.dayOfWeek)}
              memberCount={promise.memberCount}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[#B2B2B2] font-Pretendard font-semibold text-[0.75rem] leading-4.2">
          지난 약속 {pastPromises.length}
        </p>
        <div className="flex flex-col gap-5">
          {pastPromises.map(promise => (
            <PromiseCard
              key={promise.id}
              planStatus={promise.planStatus}
              title={promise.title}
              date={formatDate(promise.promisedAt, promise.dayOfWeek)}
              memberCount={promise.memberCount}
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-30 px-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)]">
        <BottomButton
          icon={<img src={PlusIcon} />}
          text="새 약속 만들기"
          onClick={handleBottomButton}
        />
      </div>
    </div>
  ) : (
    <div className="pt-8 px-4">
      <p className="text-[#111111] font-Pretendard font-semibold text-[1.75rem] whitespace-pre-line leading-10">
        {`안녕하세요,\n약속을 시작해 볼까요?`}
      </p>
      <div className="flex flex-col items-center pt-29.5">
        <img src={NonePromiseIcon} />
        <div className="flex flex-col text-center gap-1">
          <p className="text-[#111111] font-Pretendard font-semibold text-[1rem] leading-5.6">
            아직 약속이 없어요
          </p>
          <p className="text-[#B2B2B2] font-Pretendard font-normal text-[1rem] leading-5.6">
            친구들과 함께 약속을 정해 보세요
          </p>
        </div>
      </div>
      <div className="fixed bottom-30 px-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)]">
        <BottomButton
          icon={<img src={PlusIcon} />}
          text="첫 약속 만들기"
          onClick={handleBottomButton}
        />
      </div>
    </div>
  );
};

export default Home;
