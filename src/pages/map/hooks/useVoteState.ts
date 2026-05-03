import { useState } from 'react';
import type { Marker } from '@/types/map';

interface UseVoteStateProps {
  isMultipleVoting: boolean;
}

// 마커 목록 및 단일/복수 투표 상태 관리
export const useVoteState = ({ isMultipleVoting }: UseVoteStateProps) => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [votedPlace, setVotedPlace] = useState<string | null>(null);
  const [votedPlaces, setVotedPlaces] = useState<Set<string>>(new Set());

  // 좌표 기반 고유 키 생성
  const placeKey = (lat: number, lng: number) => `${lat}_${lng}`;

  // 후보지 마커 추가 또는 제거
  const handleToggleAdd = (isAdded: boolean, pendingPlace: Marker) => {
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

  // 단일/복수 투표 토글
  const handleToggleVote = (voted: boolean, pendingPlace: Marker) => {
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

  // 현재 pendingPlace의 투표 여부 반환
  const getIsVoted = (pendingPlace: Marker | null): boolean => {
    if (!pendingPlace) return false;
    const key = placeKey(pendingPlace.lat, pendingPlace.lng);
    return isMultipleVoting ? votedPlaces.has(key) : votedPlace === key;
  };

  return {
    markers,
    votedPlace,
    votedPlaces,
    placeKey,
    handleToggleAdd,
    handleToggleVote,
    getIsVoted,
  };
};
