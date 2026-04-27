import { useState, useEffect } from 'react';
import { Map as KakaoMap } from 'react-kakao-maps-sdk';
import BottomSheet from '@/components/common/BottomSheet';
import BottomButton from '@/components/common/BottomButton';
import WarningIcon from '@/assets/images/warningIcon.svg';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="w-full h-screen pb-24">
      <KakaoMap center={center} style={{ width: '100%', height: '100%' }} />
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="flex flex-col px-5 pt-12 gap-15"
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
    </div>
  );
};

export default Map;
