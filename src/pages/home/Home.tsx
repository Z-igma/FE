import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import PromiseCard from './components/PromiseCard';
import BottomButton from '@/components/common/BottomButton';
import FixBottomLayout from '@/components/layout/FixBottomLayout';
import { formatDate, usePromiseList } from './hooks/usePromiseList';
import NonePromiseIcon from '@/assets/images/home/nonePromiseIcon.svg';
import PlusIcon from '@/assets/images/plusIcon.svg';

const Home = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const { activePromises, pastPromises, hasPromise } = usePromiseList();

  const isLoggedIn = !!accessToken;

  // 로그인 후 약속 생성 가능
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
              promiseId={promise.id}
              promiseStatus={promise.promiseStatus}
              title={promise.title}
              date={formatDate(promise.promisedAt, promise.dayOfWeek)}
              memberCount={promise.memberCount}
              isLeader={promise.isLeader}
              onClick={() =>
                navigate(`/map/${promise.id}`, { state: { promise } })
              }
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
              promiseId={promise.id}
              promiseStatus={promise.promiseStatus}
              title={promise.title}
              date={formatDate(promise.promisedAt, promise.dayOfWeek)}
              memberCount={promise.memberCount}
              isPast={true}
              onClick={() =>
                navigate(`/map/${promise.id}`, { state: { promise } })
              }
            />
          ))}
        </div>
      </div>

      <FixBottomLayout>
        <BottomButton
          icon={<img src={PlusIcon} />}
          text="새 약속 만들기"
          onClick={handleBottomButton}
        />
      </FixBottomLayout>
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
      <FixBottomLayout>
        <BottomButton
          icon={<img src={PlusIcon} />}
          text="첫 약속 만들기"
          onClick={handleBottomButton}
        />
      </FixBottomLayout>
    </div>
  );
};

export default Home;
