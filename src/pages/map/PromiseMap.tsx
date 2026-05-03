import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  MarkerClusterer,
} from 'react-kakao-maps-sdk';
import LocationBottomSheet from './components/LocationBottomSheet';
import VoteBottomSheet from './components/VoteBottomSheet';
import CommentBottomSheet from './components/CommentBottomSheet';
import LocationMarker from './components/LocationMarker';
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

interface Comment {
  id: string;
  lat: number;
  lng: number;
  text: string;
}

const PromiseMap = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { promiseId } = useParams();
  const promise = state?.promise;

  const [center, setCenter] = useState({ lat: 37.5823688, lng: 127.0111299 });

  // 바텀 시트 관리
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null,
  );
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [pendingPlace, setPendingPlace] = useState<Marker | null>(null);

  // 단일 투표
  const [votedPlace, setVotedPlace] = useState<string | null>(null);
  // 복수 투표
  const [votedPlaces, setVotedPlaces] = useState<Set<string>>(new Set());
  const placeKey = (lat: number, lng: number) => `${lat}_${lng}`;

  const [showToast, setShowToast] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedOverlay, setSelectedOverlay] = useState<Marker | null>(null);

  // 코멘트 관련 상태
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [commentLatLng, setCommentLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);

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
    if (openCommentId) return;
    if (selectedOverlay) return;

    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();

    // 코멘트 모드 분기
    if (isCommentMode) {
      setIsSheetOpen(false);
      setSelectedOverlay(null);
      setCommentLatLng({ lat, lng });
      setIsChatOpen(true);
      setIsCommentMode(false);
      return;
    }

    setSelectedOverlay(null);
    if (isSheetOpen) {
      setIsSheetOpen(false);
      return;
    }

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
    ? markers.some(m => m.placeName === pendingPlace.placeName)
    : false;

  // 마커 추가 및 제거
  const handleToggleAdd = (isAdded: boolean) => {
    if (!pendingPlace) return;

    if (isAdded) {
      setMarkers(prev => {
        const alreadyExists = prev.some(
          m => m.placeName === pendingPlace.placeName,
        );
        if (alreadyExists) return prev;
        return [...prev, { ...pendingPlace }];
      });
    } else {
      setMarkers(prev =>
        prev.filter(m => m.placeName !== pendingPlace.placeName),
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

  const isConfirmed = false;

  // 모바일 오류 해결
  const generateId = () =>
    Math.random().toString(36).slice(2) + Date.now().toString(36);

  const handleGoVoteResult = () => {
    navigate(`/map/${promiseId}/vote`, {
      state: {
        promise,
        markers,
        votedPlaces: [...votedPlaces],
        votedPlace,
      },
    });
  };

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
            <>
              {/* 선택된 마커는 숨김 */}
              {!(
                selectedOverlay?.lat === marker.lat &&
                selectedOverlay?.lng === marker.lng
              ) && (
                <MapMarker
                  key={`marker-${i}`}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  image={{
                    src: CustomMarkerIcon,
                    size: { width: 30, height: 30 },
                  }}
                  onClick={() => setSelectedOverlay(marker)}
                />
              )}

              {/* 선택된 마커 위치에 말풍선 표시 */}
              {selectedOverlay?.lat === marker.lat &&
                selectedOverlay?.lng === marker.lng && (
                  <CustomOverlayMap
                    key={`overlay-${i}`}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    yAnchor={1}
                    xAnchor={0}
                  >
                    <LocationMarker
                      name={marker.placeName}
                      onClick={() => {
                        setPendingPlace(marker);
                        setSelectedPlace({
                          placeName: marker.placeName,
                          address: marker.address,
                          proposedBy: '나',
                        });
                        setIsSheetOpen(true);
                        setSelectedOverlay(null);
                      }}
                    />
                  </CustomOverlayMap>
                )}
            </>
          ))}
        </MarkerClusterer>

        {/* 등록된 코멘트 핀 */}
        {comments.map(comment => (
          <CustomOverlayMap
            key={comment.id}
            position={{ lat: comment.lat, lng: comment.lng }}
            yAnchor={1}
            xAnchor={0.5}
          >
            <div className="flex flex-col items-center">
              {openCommentId === comment.id && (
                <div
                  className="relative flex flex-col gap-1 mb-2 p-2 bg-[#353535] rounded-lg shadow-lg w-34"
                  onClick={e => {
                    e.stopPropagation();
                    setOpenCommentId(null);
                  }}
                >
                  {/* 상단 프로필 + 이름 */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <img
                      src={MapMemberIcon}
                      className="w-4 h-4 rounded-full"
                      alt="프로필"
                    />
                    <span className="text-[#FFFFFF] text-[0.5rem] font-semibold leading-2">
                      000
                    </span>
                  </div>
                  {/* 댓글 텍스트 */}
                  <p className="text-[#FFFFFF] text-[0.5rem] font-light leading-2">
                    {comment.text}
                  </p>
                  {/* 왼쪽 아래 꼬리 */}
                  <div className="absolute -left-2 top-9 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-8 border-t-transparent border-b-transparent border-r-[#2D2D2D]" />
                </div>
              )}
              {openCommentId !== comment.id && (
                <div className="relative">
                  <div
                    className="w-7.5 h-7.5 rounded-full bg-[#00408E] flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      setOpenCommentId(
                        openCommentId === comment.id ? null : comment.id,
                      );
                    }}
                  >
                    <img src={MapMemberIcon} className="w-5.5 h-5.5" />
                  </div>
                  <div className="absolute -bottom-1 left-1 w-0 h-0 border-t-10 border-r-15 border-t-[#00408E] border-r-transparent rotate-12" />
                </div>
              )}
            </div>
          </CustomOverlayMap>
        ))}
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
      {!isSheetOpen && !isChatOpen && (
        <div
          className={`absolute right-6 z-50 ${markers.length > 0 ? 'bottom-48' : 'bottom-35'}`}
          onClick={() => {
            setIsSheetOpen(false);
            setSelectedOverlay(null);
            setIsCommentMode(prev => !prev);
          }}
        >
          <div
            className={`flex pl-3 pt-3 pr-3.5 pb-3.5 w-15 h-15 rounded-full transition-colors ${isCommentMode ? 'bg-[#FF6B35]' : 'bg-[#00408E]'}`}
          >
            <img src={ChatIcon} />
          </div>
        </div>
      )}

      {isChatOpen && (
        <CommentBottomSheet
          isOpen={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            setCommentLatLng(null);
          }}
          latLng={commentLatLng}
          onSubmit={(text, latLng) => {
            setComments(prev => [
              ...prev,
              { id: generateId(), ...latLng, text },
            ]);
          }}
        />
      )}

      {/* 마커 없을 때 안내 토스트 */}
      {showToast && isOnline && !isCommentMode && (
        <>
          <div className="fixed inset-x-0 top-0 bottom-24 bg-[rgba(17,17,17,0.40)] backdrop-blur-sm flex items-center justify-center z-50" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <ToastMessage
              title="장소가 없어요"
              subTitle="지도를 눌러 추가해 보세요"
            />
          </div>
        </>
      )}

      {/* 오프라인 토스트 */}
      {!isOnline && (
        <>
          <div className="fixed inset-x-0 top-0 bottom-24 bg-[rgba(17,17,17,0.40)] backdrop-blur-sm flex items-center justify-center z-50" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <ToastMessage
              title="오프라인 상태입니다"
              subTitle="장소를 추가할 수 없어요"
            />
          </div>
        </>
      )}

      {/* 마커가 하나 이상이면 투표 바텀 시트 표시 */}
      {markers.length > 0 && !isCommentMode && !isChatOpen && (
        <VoteBottomSheet
          isOpen={!isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          count={markers.length}
          promiseId={promiseId}
          promise={promise}
          onGoResult={handleGoVoteResult}
          markers={markers}
          votedPlaces={[...votedPlaces]}
          votedPlace={votedPlace}
        />
      )}

      {/* 장소 선택 시 상세 바텀 시트 */}
      {selectedPlace && !isCommentMode && (
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
