import { useState } from 'react';
import type { Comment } from '@/types/map';

// 모바일 환경에서 UUID 오류 해결
const generateId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

// 코멘트 모드 토글, 코멘트 목록, 채팅 바텀 시트 상태 관리
export const useComment = () => {
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [commentLatLng, setCommentLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);

  // 코멘트 목록에 추가
  const handleCommentSubmit = (
    text: string,
    latLng: { lat: number; lng: number },
  ) => {
    setComments(prev => [...prev, { id: generateId(), ...latLng, text }]);
  };

  // 채팅 바텀 시트 닫기 + 좌표 초기화
  const handleChatClose = () => {
    setIsChatOpen(false);
    setCommentLatLng(null);
  };

  return {
    isCommentMode,
    setIsCommentMode,
    isChatOpen,
    setIsChatOpen,
    commentLatLng,
    setCommentLatLng,
    comments,
    openCommentId,
    setOpenCommentId,
    handleCommentSubmit,
    handleChatClose,
  };
};
