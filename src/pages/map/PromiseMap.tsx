import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import LocationBottomSheet from './components/LocationBottomSheet';
import MapMemberIcon from '@/assets/images/map/mapMemberIcon.svg';
import CustomMarkerIcon from '@/assets/images/map/customMarkerIcon.svg';
import AddedMarkerIcon from '@/assets/images/map/addedMarkerIcon.svg';
import VoteBottomSheet from './components/VoteBottomSheet';

const PromiseMap = () => {
  const { state } = useLocation();
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
      {markers.length > 0 && (
        <VoteBottomSheet
          isOpen={!isSheetOpen}
          onClose={() => setIsSheetOpen(true)}
          count={2} // 임시
        />
      )}
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
