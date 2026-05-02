import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import LocationBottomSheet from './components/LocationBottomSheet';
import VoteBottomSheet from './components/VoteBottomSheet';
import ChatBottomSheet from './components/ChatBottomSheet';
import ToastMessage from '@/components/common/ToastMessage';
import MapMemberIcon from '@/assets/images/map/mapMemberIcon.svg';
import CustomMarkerIcon from '@/assets/images/map/customMarkerIcon.svg';
import ChatIcon from '@/assets/images/map/chatIcon.svg';

const CATEGORIES = [
  'FD6', // 음식점
  'CE7', // 카페
  'CT1', // 문화 시설
  'AT4', // 관광 명소
];

interface Marker {
  lat: number;
  lng: number;
  placeName: string;
  address: string;
}

interface SelectedPlace {
  placeName: string;
  address: string;
  proposedBy: string;
}

const PromiseMap = () => {
  const { state } = useLocation();
  const { promiseId } = useParams();
  const promise = state?.promise;

  const [center, setCenter] = useState({ lat: 37.5823688, lng: 127.0111299 });

  // 바텀 시트 관리
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>( // 선택된 장소 정보
    null,
  );
  const [markers, setMarkers] = useState<Marker[]>([]); // 등록된 마커
  const [pendingPlace, setPendingPlace] = useState<Marker | null>(null);

  // 단일 투표
  const [votedPlace, setVotedPlace] = useState<string | null>(null);
  // 복수 투표
  const [votedPlaces, setVotedPlaces] = useState<Set<string>>(new Set());
  const placeKey = (lat: number, lng: number) => `${lat}_${lng}`;

  const [showToast, setShowToast] = useState(true); // 토스트 메시지 관리
  const [isOnline, setIsOnline] = useState(navigator.onLine); // 네트워크 상태

  // 사용자 위치를 중심으로 설정
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 온오프라인 감지
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

  if (!promise) return null;

  const isMultipleVoting = promise?.isMultipleVoting ?? false;

  // 클릭 좌표 내 음식점 조회
  const findNearestPlace = (
    lat: number,
    lng: number,
    callback: (placeName: string) => void,
  ) => {
    const places = new kakao.maps.services.Places();
    const location = new kakao.maps.LatLng(lat, lng);

    const results: kakao.maps.services.PlacesSearchResult = [];

    let completed = 0;

    CATEGORIES.forEach(category => {
      places.categorySearch(
        category as any,
        (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            results.push(...result);
          }
          completed++;

          // 모든 카테고리 조회 완료 시
          if (completed === CATEGORIES.length) {
            if (results.length === 0) {
              callback('선택한 위치');
              return;
            }

            // 거리순 정렬 후 가장 가까운 장소 반환
            results.sort((a, b) => Number(a.distance) - Number(b.distance));
            callback(results[0].place_name);
          }
        },
        { location, radius: 50, sort: kakao.maps.services.SortBy.DISTANCE },
      );
    });
  };

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

    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status !== kakao.maps.services.Status.OK) return;

      const address =
        result[0].road_address?.address_name ?? result[0].address.address_name;

      findNearestPlace(lat, lng, placeName => {
        setPendingPlace({ lat, lng, placeName, address });
        setSelectedPlace({ placeName, address, proposedBy: '나' });
        setIsSheetOpen(true);
      });
    });
  };

  const isPendingAdded = pendingPlace
    ? markers.some(
        m => m.lat === pendingPlace.lat && m.lng === pendingPlace.lng,
      )
    : false;

  // 마커 추가 및 제거
  const handleToggleAdd = (isAdded: boolean) => {
    if (!pendingPlace) return;

    if (isAdded) {
      setMarkers(prev => {
        const alreadyExists = prev.some(
          m => m.lat === pendingPlace.lat && m.lng === pendingPlace.lng,
        );
        if (alreadyExists) return prev;
        return [...prev, { ...pendingPlace }];
      });
    } else {
      setMarkers(prev =>
        prev.filter(
          m => !(m.lat === pendingPlace.lat && m.lng === pendingPlace.lng),
        ),
      );
    }
  };

  // 투표 토글
  const handleToggleVote = (voted: boolean) => {
    if (!pendingPlace) return;
    const key = placeKey(pendingPlace.lat, pendingPlace.lng);

    if (isMultipleVoting) {
      setVotedPlaces(prev => {
        const next = new Set(prev);
        voted ? next.add(key) : next.delete(key);
        return next;
      });
    } else {
      setVotedPlace(voted ? key : null);
    }
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setPendingPlace(null);
  };

  // 현재 장소 투표 여부
  const isVoted = pendingPlace
    ? isMultipleVoting
      ? votedPlaces.has(placeKey(pendingPlace.lat, pendingPlace.lng))
      : votedPlace === placeKey(pendingPlace.lat, pendingPlace.lng)
    : false;

  const isConfirmed = true;

  return (
    <div className="relative w-full h-screen pb-24 overflow-hidden">
      <Map
        center={center}
        style={{ width: '100%', height: '100%' }}
        onClick={handleMapClick}
      >
        <MarkerClusterer
          averageCenter={true}
          minLevel={5}
          styles={[
            {
              width: '2.5rem',
              height: '2.5rem',
              background: '#00408E',
              borderRadius: '50%',
              color: '#FFFFFF',
              fontFamily: 'Pretendard',
              fontWeight: '600',
              fontSize: '0.875rem',
              lineHeight: '2.5rem',
              textAlign: 'center',
            },
          ]}
        >
          {markers.map((marker, i) => (
            <MapMarker
              key={i}
              position={{ lat: marker.lat, lng: marker.lng }}
              image={{ src: CustomMarkerIcon, size: { width: 30, height: 30 } }}
              onClick={() => {
                setPendingPlace(marker);
                setSelectedPlace({
                  placeName: marker.placeName,
                  address: marker.address,
                  proposedBy: '나',
                });
                setIsSheetOpen(true);
              }}
            />
          ))}
        </MarkerClusterer>
      </Map>

      {/* 약속 정보 카드 */}
      <div className="absolute top-0 left-0 pl-4 pt-5 z-10">
        <div className="px-4.5 py-4 flex flex-col items-start gap-1 bg-[#FFFFFF] border border-[#C6C6C6] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)]">
          <p className="text-[#111111] font-Pretendard font-semibold text-[1.125rem] leading-4.5">
            {promise?.title}
          </p>
          <div className="flex">
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

      {/* 채팅 버튼 */}
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

      {/* 마커 없을 때 안내 토스트 */}
      {showToast && isOnline && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <ToastMessage
            title="장소가 없어요"
            subTitle="지도를 눌러 추가해 보세요"
          />
        </div>
      )}

      {/* 오프라인 토스트 */}
      {!isOnline && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <ToastMessage
            title="오프라인 상태입니다"
            subTitle="장소를 추가할 수 없어요"
          />
        </div>
      )}

      {/* 마커가 하나 이상이면 투표 바텀 시트 표시 */}
      {markers.length > 0 && (
        <VoteBottomSheet
          isOpen={!isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          count={2}
          promiseId={promiseId}
          promise={promise}
        />
      )}

      {/* 장소 선택 시 상세 바텀 시트 */}
      {selectedPlace && (
        <LocationBottomSheet
          isOpen={isSheetOpen}
          onClose={handleSheetClose}
          placeName={selectedPlace.placeName}
          address={selectedPlace.address}
          proposedBy={selectedPlace.proposedBy}
          isAdded={isPendingAdded}
          onToggleAdd={handleToggleAdd}
          isVoted={isVoted}
          onToggleVote={handleToggleVote}
          isConfirmed={isConfirmed}
        />
      )}
    </div>
  );
};

export default PromiseMap;
