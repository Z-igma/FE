import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import NoneScheduleIcon from '@/assets/images/home/noneScheduleIcon.svg';
import BottomButton from '@/components/common/BottomButton';
import PlusIcon from '@/assets/images/plusIcon.svg';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const hasSchedule = false;

  // 비로그인 상태에서 약속 생성하고자 할 경우 로그인 화면
  const handleBottomButton = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      // 약속 생성 화면으로 이동
    }
  };

  return isLoggedIn && hasSchedule ? (
    <div className="flex flex-col pt-8 px-4 gap-5">
      <p className="text-[#111111] font-[Pretendard] font-semibold text-[1.75rem] whitespace-pre-line leading-10">
        {`약속 장소\n친구들과 함께 정해요`}
      </p>
      <BottomButton
        icon={<img src={PlusIcon} />}
        text="새 약속 만들기"
        onClick={handleBottomButton}
      />
    </div>
  ) : (
    <div className="pt-8 px-4">
      <p className="text-[#111111] font-[Pretendard] font-semibold text-[1.75rem] whitespace-pre-line leading-10">
        {`안녕하세요,\n약속을 시작해 볼까요?`}
      </p>
      <div className="flex flex-col items-center pt-29.5">
        <img src={NoneScheduleIcon} />
        <div className="flex flex-col text-center gap-1">
          <p className="text-[#111111] font-[Pretendard] font-semibold text-[1rem] leading-5.6">
            아직 약속이 없어요
          </p>
          <p className="text-[#B2B2B2] font-[Pretendard] font-normal text-[1rem] leading-5.6">
            친구들과 함께 약속을 정해 보세요
          </p>
        </div>
      </div>
      <BottomButton
        icon={<img src={PlusIcon} />}
        text="첫 약속 만들기"
        onClick={handleBottomButton}
      />
    </div>
  );
};

export default Home;
