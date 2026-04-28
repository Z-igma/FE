import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import LocationBottomSheet from './components/LocationBottomSheet';
import VoteBottomSheet from './components/VoteBottomSheet';
import ChatBottomSheet from './components/ChatBottomSheet';
import ToastMessage from '@/components/common/ToastMessage';
import MapMemberIcon from '@/assets/images/map/mapMemberIcon.svg';
import CustomMarkerIcon from '@/assets/images/map/customMarkerIcon.svg';
import AddedMarkerIcon from '@/assets/images/map/addedMarkerIcon.svg';
import ChatIcon from '@/assets/images/map/chatIcon.svg';

const PromiseMap = () => {
  const { state } = useLocation();
  const { promiseId } = useParams();
  const promise = state?.promise; // 약속 정보

  const [center, setCenter] = useState({ lat: 37.5823688, lng: 127.0111299 });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // 바텀 시트에 표시될 정보
  const [selectedPlace, setSelectedPlace] = useState<{
    placeName: string;
    address: string;
    proposedBy: string;
  } | null>(null);
  // 지도에 찍힌 마커 배열
  const [markers, setMarkers] = useState<
    {
      lat: number;
      lng: number;
      placeName: string;
      address: string;
      isAdded: boolean;
    }[]
  >([]);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(
    null,
  );
  const [showToast, setShowToast] = useState(true); // 토스트 메시지 연결
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // 위치 허용 시 사용자 위치 기준으로 지도 표시
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  if (!promise) return null;

  // 클릭한 좌표 주변에서 가장 가까운 가게명 찾기
  const findNearestPlace = (
    lat: number,
    lng: number,
    callback: (placeName: string) => void,
  ) => {
    const places = new kakao.maps.services.Places();
    const location = new kakao.maps.LatLng(lat, lng);

    places.categorySearch(
      'FD6', // 음식점 카테고리
      (result, status) => {
        if (status === kakao.maps.services.Status.OK && result.length > 0) {
          callback(result[0].place_name);
          return;
        }

        callback('선택한 위치');
      },
      {
        location,
        radius: 50,
        sort: kakao.maps.services.SortBy.DISTANCE,
      },
    );
  };

  // 지도 클릭 시 마커 추가 + 주소 조회 + 주변 가게명 조회
  const handleMapClick = (
    _: kakao.maps.Map,
    mouseEvent: kakao.maps.event.MouseEvent,
  ) => {
    if (isSheetOpen) {
      setIsSheetOpen(false);
      return;
    }

    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();

    const geocoder = new kakao.maps.services.Geocoder();

    // 좌표 > 주소 변환
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status !== kakao.maps.services.Status.OK) return;

      const address = result[0].road_address
        ? result[0].road_address.address_name
        : result[0].address.address_name;

      // 가게명 조회 > 마커 추가 및 바텀 시트 열기
      findNearestPlace(lat, lng, placeName => {
        setMarkers(prev => {
          const next = [
            ...prev,
            { lat, lng, placeName, address, isAdded: false },
          ];
          setSelectedMarkerIndex(next.length - 1);
          return next;
        });
        setSelectedPlace({ placeName, address, proposedBy: '나' });
        setIsSheetOpen(true);
      });
    });
  };

  // 토스트 메시지 관리
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 오프라인 여부 확인
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

  return (
    <div className="relative w-full h-screen pb-24 overflow-hidden">
      <Map
        center={center}
        style={{ width: '100%', height: '100%' }}
        onClick={handleMapClick}
      >
        {/* 클릭한 위치에 마커 표시 */}
        {markers.map((marker, i) => (
          <MapMarker
            key={i}
            position={{ lat: marker.lat, lng: marker.lng }}
            image={{
              src: marker.isAdded ? AddedMarkerIcon : CustomMarkerIcon,
              size: { width: 30, height: 30 },
            }}
            onClick={() => {
              setSelectedMarkerIndex(i);
              setSelectedPlace({
                placeName: marker.placeName,
                address: marker.address,
                proposedBy: '나',
              });
              setIsSheetOpen(true);
            }}
          />
        ))}
      </Map>
      <div className="absolute top-0 left-0 pl-4 pt-5 z-10">
        <div className="px-4.5 py-4 flex flex-col items-start gap-1 bg-[#FFFFFF] border border-[#C6C6C6] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)]">
          <p className="text-[#111111] font-Pretendard font-semibold text-[1.125rem] leading-4.5">
            {promise?.title}
          </p>
          <div className="flex">
            {/* 참여자 인원으로 변경 예정 */}
            {Array.from({ length: promise?.memberCount ?? 1 }).map((_, i) => (
              <img
                key={i}
                src={MapMemberIcon}
                className="w-5 h-5"
                style={{ marginLeft: i === 0 ? 0 : '-3px' }}
                alt="참여자"
              />
            ))}
          </div>
        </div>
      </div>

      {/* 댓글 바텀 시트만 구현 + 위치 지정 미구현 */}
      {!isSheetOpen && (
        <div
          className={`absolute right-6 z-50 ${markers.length > 0 ? 'bottom-48' : 'bottom-30'}`}
          onClick={() => setIsChatOpen(true)}
        >
          <div className="flex pl-3 pt-3 pr-3.5 pb-3.5 w-15 h-15 rounded-full bg-[#00408E]">
            <img src={ChatIcon} />
          </div>
        </div>
      )}

      <ChatBottomSheet
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* 마커 없을 경우 토스트 메시지 */}
      {showToast && isOnline && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <ToastMessage
            title="장소가 없어요"
            subTitle="지도를 눌러 추가해 보세요"
          />
        </div>
      )}

      {/* 오프라인일 경우 토스트 메시지 */}
      {!isOnline && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <ToastMessage
            title="오프라인 상태입니다"
            subTitle="장소를 추가할 수 없어요"
          />
        </div>
      )}

      {/* 마커 존재할 경우 기본 바텀 시트 */}
      {markers.length > 0 && (
        <VoteBottomSheet
          isOpen={!isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          count={2} // 임시
          promiseId={promiseId}
          promise={promise}
        />
      )}

      {/* 마커 등록 시 가게 정보 바텀 시트 */}
      {selectedPlace && (
        <LocationBottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          placeName={selectedPlace.placeName}
          address={selectedPlace.address}
          proposedBy={selectedPlace.proposedBy}
          isAdded={
            selectedMarkerIndex !== null
              ? markers[selectedMarkerIndex].isAdded
              : false
          }
          onToggleAdd={isAdded => {
            setMarkers(prev =>
              prev.map((m, i) =>
                i === selectedMarkerIndex ? { ...m, isAdded } : m,
              ),
            );
          }}
        />
      )}
    </div>
  );
};

export default PromiseMap;
