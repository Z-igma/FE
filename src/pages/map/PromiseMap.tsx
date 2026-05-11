import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { useMapSheet } from './hooks/useMapSheet';
import { useComment } from './hooks/useComment';
import type { GetCommentsParams } from '@/types/map/comment.type';
import CustomMarkerIcon from '@/assets/images/map/customMarkerIcon.svg';
import CommentIcon from '@/assets/images/map/commentIcon.svg';
import { useGetCandidatePlaces } from './services/useVotePalce';
import { usePromiseDetail } from './services/usePromiseDetail';
import { useAuthStore } from '@/stores/authStore';
import { usePostJoinPromise } from '@/apis/apiHooks/usePromiseInvite';

const PromiseMap = () => {
  const [bounds, setBounds] = useState<GetCommentsParams>({
    minLat: 37.55,
    maxLat: 37.61,
    minLng: 126.98,
    maxLng: 127.04,
  });

  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('inviteCode');
  const navigate = useNavigate();
  const { promiseId } = useParams();
  const parsedPromiseId = Number(promiseId);
  const { data: promise } = usePromiseDetail(parsedPromiseId);

  const {accessToken} = useAuthStore();

  const { mutate: joinPromise } = usePostJoinPromise();

  useEffect(() => {
    if (!inviteCode) return;  // inviteCode 없으면 그냥 일반 접근

    if (!accessToken) {
      // 로그인 안 됐으면 저장하고 로그인 페이지로
      sessionStorage.setItem('inviteCode', inviteCode);
      sessionStorage.setItem('redirectPage', `/map/${promiseId}`);
      navigate('/login');
      return;
    }

    joinPromise(inviteCode);
  }, [inviteCode, accessToken]);

  const { center, isOnline } = useMapLocation();

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
  } = useComment(Number(promiseId), bounds);

  const {
    isSheetOpen,
    setIsSheetOpen,
    selectedPlace,
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

  const [showToast, setShowToast] = useState(false);
  const hasCheckedInitial = useRef(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  const { data: candidatePlacesResponse } = useGetCandidatePlaces(promiseId);
  const candidatePlaces = candidatePlacesResponse?.data.candidates;
  const candidatePlacesCount = candidatePlacesResponse?.data.candidateCount;

  console.log('candidatePlacesResponse: ', candidatePlacesResponse);
  
  const isConfirmed = candidatePlaces?.some(c => c.isConfirmed) ?? false;

  useEffect(() => {
    if (!candidatePlacesResponse) return;
    if (hasCheckedInitial.current) return;

    hasCheckedInitial.current = true;

    if (candidatePlacesCount === 0) {
      setShowToast(true);
    }
  }, [candidatePlacesResponse, candidatePlacesCount]);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 2000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleGoVoteResult = () => {
    navigate(`/map/${promiseId}/vote`);
  };

  if (!promise) return null;

  const isLeader = promise.isLeader;

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Map
        center={center}
        style={{ width: '100%', height: 'calc(100% - 6rem)' }}
        onClick={handleMapClick}
        onIdle={map => {
          const b = map.getBounds();
          setBounds({
            minLat: b.getSouthWest().getLat(),
            maxLat: b.getNorthEast().getLat(),
            minLng: b.getSouthWest().getLng(),
            maxLng: b.getNorthEast().getLng(),
          });
        }}
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
          {candidatePlaces?.map((candidatePlace, i) => (
            <>
              {/* 선택된 마커는 숨김 */}
              {!(
                selectedOverlay?.lat === candidatePlace.latitude &&
                selectedOverlay?.lng === candidatePlace.longitude
              ) && (
                <MapMarker
                  key={`marker-${i}`}
                  position={{
                    lat: candidatePlace.latitude,
                    lng: candidatePlace.longitude,
                  }}
                  image={{
                    src: CustomMarkerIcon,
                    size: { width: 30, height: 30 },
                  }}
                  onClick={() =>
                    setSelectedOverlay({
                      lat: candidatePlace.latitude,
                      lng: candidatePlace.longitude,
                      placeName: candidatePlace.name,
                      address: candidatePlace.address,
                    })
                  }
                />
              )}

              {/* 선택된 마커 위치에 말풍선 표시 */}
              {selectedOverlay?.lat === candidatePlace.latitude &&
                selectedOverlay?.lng === candidatePlace.longitude && (
                  <CustomOverlayMap
                    key={`overlay-${i}`}
                    position={{
                      lat: candidatePlace.latitude,
                      lng: candidatePlace.longitude,
                    }}
                    yAnchor={1}
                    xAnchor={0}
                  >
                    <LocationMarker
                      name={candidatePlace.name}
                      onClick={() =>
                        handleOverlayOpen({
                          lat: candidatePlace.latitude,
                          lng: candidatePlace.longitude,
                          placeName: candidatePlace.name,
                          address: candidatePlace.address,
                        })
                      }
                    />
                  </CustomOverlayMap>
                )}
            </>
          ))}
        </MarkerClusterer>

        {/* 등록된 코멘트 */}
        {comments.map(comment => (
          <CustomOverlayMap
            key={comment.id}
            position={{ lat: comment.latitude, lng: comment.longitude }} // lat/lng → latitude/longitude
            yAnchor={1}
            xAnchor={0.5}
            clickable={true}
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
                      src={comment.profileImageUrl}
                      className="w-4 h-4 rounded-full"
                      alt="프로필"
                    />
                    <span className="text-[#FFFFFF] text-[0.5rem] font-semibold leading-2">
                      {comment.nickname}
                    </span>
                  </div>
                  <p className="text-[#FFFFFF] text-[0.5rem] font-light leading-2">
                    {comment.content}
                  </p>
                  <div className="absolute -left-2 top-9 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-8 border-t-transparent border-b-transparent border-r-[#2D2D2D]" />
                </div>
              )}
              {openCommentId !== comment.id && (
                <div className="relative">
                  <div
                    className="w-7.5 h-7.5 rounded-full bg-[#353535] flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      setOpenCommentId(
                        openCommentId === comment.id ? null : comment.id,
                      );
                    }}
                  >
                    <img
                      src={comment.profileImageUrl}
                      className="w-5.5 h-5.5 rounded-full z-10"
                    />
                  </div>
                  <div className="absolute -bottom-1 left-1 w-0 h-0 border-t-10 border-r-15 border-t-[#353535] border-r-transparent rotate-12" />
                </div>
              )}
            </div>
          </CustomOverlayMap>
        ))}
      </Map>

      {/* 약속 정보 카드 */}
      <div className="absolute top-0 left-0 pl-4 pt-5 z-10">
        <div
          className="px-4.5 py-4 flex flex-col items-start gap-2 bg-[#FFFFFF] border border-[#C6C6C6] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)] cursor-pointer"
          onClick={() => setIsCardExpanded(prev => !prev)}
        >
          <p className="text-[#111111] font-Pretendard font-semibold text-[1.125rem] leading-4.5">
            {promise.title}
          </p>
          <div
            className={`flex ${isCardExpanded ? 'flex-col gap-2' : 'flex-row'}`}
          >
            {promise.members.map((member, i) => (
              <div
                key={member.userId}
                className={`flex items-center ${isCardExpanded ? 'gap-2' : '-ml-1.5 first:ml-0'}`}
              >
                <img
                  src={member.profileImageUrl ?? ''}
                  className="w-6 h-6 rounded-full gap-[-4px]"
                  alt="참여자"
                />
                {isCardExpanded && (
                  <p className="text-[#111111] text-[0.75rem] font-medium">
                    {member.nickName}
                  </p>
                )}
              </div>
            ))}
          </div>

          {isLeader && isCardExpanded && (
            <div className="px-3 py-1 bg-[#EAF2FF] border border-[#C0D7FD] rounded-[10px] cursor-pointer">
              <p className="text-[#00408E] font-Pretendard font-regular text-[0.75rem] leading-4.2">
                멤버 초대하기
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 채팅 버튼 */}
      {!isSheetOpen && !isCommentOpen && (
        <div
          className={`absolute right-6 z-50 ${candidatePlacesCount && candidatePlacesCount > 0 ? 'bottom-48' : 'bottom-35'}`}
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
      {showToast && isOnline && candidatePlacesCount === 0 && (
        <>
          <div className="fixed inset-x-0 top-0 bottom-24 bg-[rgba(17,17,17,0.40)] backdrop-blur-sm flex items-center justify-center z-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <ToastMessage
              title="추가한 장소가 없어요"
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
      {!!candidatePlacesCount &&
        candidatePlacesCount > 0 &&
        !isCommentMode &&
        !isCommentOpen && (
          <VoteBottomSheet
            isOpen={!isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            count={candidatePlacesCount}
            onGoResult={handleGoVoteResult}
            candidatesPlaces={candidatePlaces ?? []}
          />
        )}

      {/* 장소 선택 시 상세 바텀 시트 */}
      {selectedPlace && !isCommentMode && (
        <LocationBottomSheet
          candidatesPlaces={candidatePlaces ?? []}
          promiseId={promiseId}
          isOpen={isSheetOpen}
          onClose={handleSheetClose}
          selectedPlace={selectedPlace}
          isConfirmed={isConfirmed}
        />
      )}
    </div>
  );
};

export default PromiseMap;
