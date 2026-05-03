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
import { useMapLocation } from './hooks/useMapLocation';
import { useVoteState } from './hooks/useVoteState';
import { useMapSheet } from './hooks/useMapSheet';
import { useComment } from './hooks/useComment';
import type { Comment } from '@/types/map';
import MapMemberIcon from '@/assets/images/map/mapMemberIcon.svg';
import CustomMarkerIcon from '@/assets/images/map/customMarkerIcon.svg';
import CommentIcon from '@/assets/images/map/commentIcon.svg';

const PromiseMap = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { promiseId } = useParams();
  const promise = state?.promise;

  const { center, isOnline } = useMapLocation();
  const isMultipleVoting = promise?.isMultipleVoting ?? false;

  const {
    markers,
    votedPlace,
    votedPlaces,
    handleToggleAdd,
    handleToggleVote,
    getIsVoted,
  } = useVoteState({ isMultipleVoting });

  const {
    isCommentMode,
    setIsCommentMode,
    isCommentOpen,
    setIsCommentOpen,
    commentLatLng,
    setCommentLatLng,
    comments,
    openCommentId,
    setOpenCommentId,
    handleCommentSubmit,
    handleCommentClose,
  } = useComment();

  const {
    isSheetOpen,
    setIsSheetOpen,
    selectedPlace,
    pendingPlace,
    selectedOverlay,
    setSelectedOverlay,
    handleMapClick,
    handleSheetClose,
    handleOverlayOpen,
  } = useMapSheet({
    isCommentMode,
    setIsCommentMode,
    setCommentLatLng,
    setIsCommentOpen,
    openCommentId,
  });

  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!promise) return null;

  const isPendingAdded = pendingPlace
    ? markers.some(m => m.placeName === pendingPlace.placeName)
    : false;

  const isVoted = getIsVoted(pendingPlace);
  const isConfirmed = false; // 확정된 장소 예정

  const handleGoVoteResult = () => {
    navigate(`/map/${promiseId}/vote`, {
      state: { promise, markers, votedPlaces: [...votedPlaces], votedPlace },
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Map
        center={center}
        style={{ width: '100%', height: 'calc(100% - 6rem)' }}
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
                      onClick={() => handleOverlayOpen(marker)}
                    />
                  </CustomOverlayMap>
                )}
            </>
          ))}
        </MarkerClusterer>

        {/* 등록된 코멘트 */}
        {comments.map((comment: Comment) => (
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
                  <p className="text-[#FFFFFF] text-[0.5rem] font-light leading-2">
                    {comment.text}
                  </p>
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
      {!isSheetOpen && !isCommentOpen && (
        <div
          className={`absolute right-6 z-50 ${markers.length > 0 ? 'bottom-48' : 'bottom-35'}`}
          onClick={() => {
            setIsSheetOpen(false);
            setSelectedOverlay(null);
            setIsCommentMode(prev => !prev);
          }}
        >
          <div
            className={`flex pl-3 pt-3 pr-3.5 pb-3.5 w-15 h-15 rounded-full transition-colors ${isCommentMode ? 'bg-[#C6C6C6]' : 'bg-[#00408E]'}`}
          >
            <img src={CommentIcon} />
          </div>
        </div>
      )}

      {isCommentOpen && (
        <CommentBottomSheet
          isOpen={isCommentOpen}
          onClose={handleCommentClose}
          latLng={commentLatLng}
          onSubmit={handleCommentSubmit}
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
      {markers.length > 0 && !isCommentMode && !isCommentOpen && (
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
          onToggleAdd={isAdded =>
            pendingPlace && handleToggleAdd(isAdded, pendingPlace)
          }
          isVoted={isVoted}
          onToggleVote={isVotedNext =>
            pendingPlace && handleToggleVote(isVotedNext, pendingPlace)
          }
          isConfirmed={isConfirmed}
        />
      )}
    </div>
  );
};

export default PromiseMap;
