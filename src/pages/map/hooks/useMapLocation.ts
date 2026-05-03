import { useEffect, useState } from 'react';

interface MapLocation {
  center: { lat: number; lng: number };
  isOnline: boolean;
}

// 사용자 위치 중심으로 설정 및 온오프라인 상태 감지
export const useMapLocation = (): MapLocation => {
  const [center, setCenter] = useState({ lat: 37.5823688, lng: 127.0111299 });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 사용자 위치를 지도 중심으로 설정
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  // 온오프라인 상태 감지
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { center, isOnline };
};
