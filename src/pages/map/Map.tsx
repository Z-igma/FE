import { useState, useEffect } from 'react';
import { Map as KakaoMap } from 'react-kakao-maps-sdk';

const Map = () => {
  const [center, setCenter] = useState({ lat: 37.5823688, lng: 127.0111299 });

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
    </div>
  );
};

export default Map;
