import { useState } from 'react';
import type { Marker, SelectedPlace } from '@/types/map';

const CATEGORIES = [
  'FD6', // 음식점
  'CE7', // 카페
  'CT1', // 문화 시설
  'AT4', // 관광 명소
];

interface UseMapSheetProps {
  isCommentMode: boolean;
  setIsCommentMode: (v: boolean) => void;
  setCommentLatLng: (v: { lat: number; lng: number } | null) => void;
  setIsCommentOpen: (v: boolean) => void;
  openCommentId: number | null;
}

// 바텀 시트 열림/닫힘, 마커 미등록 장소, 지도 클릭 관리
export const useMapSheet = ({
  isCommentMode,
  setIsCommentMode,
  setCommentLatLng,
  setIsCommentOpen,
  openCommentId,
}: UseMapSheetProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null,
  );
  const [pendingPlace, setPendingPlace] = useState<Marker | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState<Marker | null>(null);

  // 클릭 좌표 반경 50m 내 가장 가까운 장소명 조회
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

          if (completed === CATEGORIES.length) {
            if (results.length === 0) {
              callback('선택한 위치');
              return;
            }
            results.sort((a, b) => Number(a.distance) - Number(b.distance));
            callback(results[0].place_name);
          }
        },
        { location, radius: 50, sort: kakao.maps.services.SortBy.DISTANCE },
      );
    });
  };

  // 지도 클릭 시 코멘트 모드/장소 조회 분기 처리
  const handleMapClick = (
    _: kakao.maps.Map,
    mouseEvent: kakao.maps.event.MouseEvent,
  ) => {
    if (openCommentId) return;
    if (selectedOverlay) return;

    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();

    if (isCommentMode) {
      setIsSheetOpen(false);
      setSelectedOverlay(null);
      setCommentLatLng({ lat, lng });
      setIsCommentOpen(true);
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

  // 바텀 시트 닫기
  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setPendingPlace(null);
  };

  // 마커 클릭 시 말풍선으로 전환
  const handleOverlayOpen = (marker: Marker) => {
    setPendingPlace(marker);
    setSelectedPlace({
      placeName: marker.placeName,
      address: marker.address,
      proposedBy: '나',
    });
    setIsSheetOpen(true);
    setSelectedOverlay(null);
  };

  return {
    isSheetOpen,
    setIsSheetOpen,
    selectedPlace,
    pendingPlace,
    selectedOverlay,
    setSelectedOverlay,
    handleMapClick,
    handleSheetClose,
    handleOverlayOpen,
  };
};
