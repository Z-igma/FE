import { useState } from 'react';
import type { TimeIndex } from '../components/TimeScrollSelector';
import { DAYS } from '../constants/promise';

// 현재 시각을 기준으로 초기 값 반환
export const getNowIndex = (): TimeIndex => {
  const now = new Date();
  const hours12 = now.getHours() % 12;
  return {
    ap: now.getHours() >= 12 ? 1 : 0,
    hr: hours12 === 0 ? 11 : hours12 - 1,
    mn: now.getMinutes(),
  };
};

// 날짜 변환 형식
export const formatDateLabel = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = DAYS[date.getDay()];
  return `${month}월 ${day}일 (${dayOfWeek})`;
};

// 약속 생성 폼 입력 상태, 에러 표시, 유효성 관리
export const useCreatePromise = () => {
  const [promiseName, setPromiseName] = useState('');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [timeIndex, setTimeIndex] = useState<TimeIndex>(getNowIndex);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isMultiVote, setIsMultiVote] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [showErrors, setShowErrors] = useState({
    promiseName: false,
    date: false,
    time: false,
    category: false,
  });

  // 모든 필수 항목 채워졌는지 확인
  const isValid =
    promiseName.trim() !== '' &&
    !!selectedDate &&
    !!selectedTime &&
    !!selectedCategory;

  // 모든 에러 표시 활성화
  const showAllErrors = () => {
    setShowErrors({
      promiseName: true,
      date: true,
      time: true,
      category: true,
    });
  };

  return {
    promiseName,
    setPromiseName,
    isDateOpen,
    setIsDateOpen,
    selectedDate,
    setSelectedDate,
    isTimeOpen,
    setIsTimeOpen,
    timeIndex,
    setTimeIndex,
    selectedTime,
    setSelectedTime,
    isMultiVote,
    setIsMultiVote,
    selectedCategory,
    setSelectedCategory,
    showErrors,
    setShowErrors,
    showAllErrors,
    isValid,
  };
};
