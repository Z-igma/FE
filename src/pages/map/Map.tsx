import { useState, useEffect } from 'react';
import { Map as KakaoMap } from 'react-kakao-maps-sdk';
import BottomSheet from '@/components/common/BottomSheet';
import BottomButton from '@/components/common/BottomButton';
import WarningIcon from '@/assets/images/warningIcon.svg';
import { useNavigate } from 'react-router-dom';

// 실제 약속 목록으로 교체 예정
const promises = [
  {
    id: 1,
    title: '저녁약속',
    promiseStatus: '장소 미정',
    promisedAt: '2026-05-28T21:26:12',
    dayOfWeek: '목',
    memberCount: 1,
  },
  {
    id: 2,
    title: '저녁약속',
    promiseStatus: '장소 미정',
    promisedAt: '2026-05-28T21:26:12',
    dayOfWeek: '목',
    memberCount: 1,
  },
];

const Map = () => {
  const navigate = useNavigate();
  const [center, setCenter] = useState({ lat: 37.5823688, lng: 127.0111299 });
  const [isOpen, setIsOpen] = useState(true);

  // 위치 허용 시 사용자 위치 기준으로 지도 표시
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  // 약속이 하나뿐이면 해당 약속의 지도로 바로 이동
  useEffect(() => {
    if (promises.length === 1) {
      navigate(`/map/${promises[0].id}`);
    }
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <KakaoMap
        center={center}
        style={{ width: '100%', height: 'calc(100% - 6rem)' }}
      />

      {/* 진행 중인 약속이 없을 때 */}
      {promises.length === 0 && (
        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="flex flex-col px-5 pt-12 gap-15"
          peekHeight="h-90"
          fullHeight="h-90"
        >
          <div className="flex flex-col items-center text-center">
            <img src={WarningIcon} />
            <div className="flex flex-col gap-1">
              <p className="text-[#111111] font-Pretendard font-semibold text-[1.375rem] leading-7.7">
                아직 진행 중인 약속이 없어요
              </p>
              <p className="text-[#111111] font-Pretendard font-light text-[0.75rem] leading-4.2">
                약속을 만들어 주세요
              </p>
            </div>
          </div>
          <BottomButton
            text="새 약속 만들기"
            textSize="1rem"
            onClick={() => navigate('/promise/create')}
          />
        </BottomSheet>
      )}

      {/* 진행 중인 약속이 여러 개일 때 */}
      {promises.length > 1 && (
        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="flex flex-col px-5 pt-12 gap-15"
          peekHeight="h-90"
          fullHeight="h-90"
        >
          <div className="flex flex-col items-center text-center">
            <img src={WarningIcon} />
            <div className="flex flex-col gap-1">
              <p className="text-[#111111] font-Pretendard font-semibold text-[1.375rem] leading-7.7">
                여러 약속이 진행 중이에요
              </p>
              <p className="text-[#111111] font-Pretendard font-light text-[0.75rem] leading-4.2">
                정보를 확인할 약속을 선택해 주세요
              </p>
            </div>
          </div>
          <BottomButton
            text="약속 선택하기"
            textSize="1rem"
            onClick={() => navigate('/home')}
          />
        </BottomSheet>
      )}
    </div>
  );
};

export default Map;
