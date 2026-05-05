import { useState } from 'react';
import { useComments, useCreateComment } from '../services/useCommentQuery';
import type { GetCommentsParams } from '@/types/map/comment.type';

export const useComment = (promiseId: number, bounds: GetCommentsParams) => {
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentLatLng, setCommentLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);

  const { data: comments = [] } = useComments(promiseId, bounds);
  const { mutate: submitComment } = useCreateComment(promiseId);

  // 코멘트 추가
  const handleCommentSubmit = (
    content: string,
    latLng: { lat: number; lng: number },
  ) => {
    submitComment({
      content,
      latitude: latLng.lat,
      longitude: latLng.lng,
    });
  };

  // 채팅 바텀 시트 닫기 + 좌표 초기화
  const handleCommentClose = () => {
    setIsCommentOpen(false);
    setCommentLatLng(null);
  };

  return {
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
  };
};
