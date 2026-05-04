import { usePromises } from '../services/usePromises';

// 약속 날짜 형식 변환
export const formatDate = (promisedAt: string, dayOfWeek: string) => {
  const date = new Date(promisedAt);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const time = promisedAt.split('T')[1].slice(0, 5);
  return `${month}월 ${day}일 (${dayOfWeek}) ${time}`;
};

// 약속 목록 진행 중 / 지난 약속 분류 반환
export const usePromiseList = () => {
  const { data, isLoading } = usePromises();
  const now = new Date();

  const promises = data?.data.promises ?? [];

  // 현재 시각 이후 약속
  const activePromises = promises.filter(
    promise => new Date(promise.promisedAt) >= now,
  );

  // 현재 시각 이전 약속
  const pastPromises = promises.filter(
    promise => new Date(promise.promisedAt) < now,
  );

  return {
    promises,
    activePromises,
    pastPromises,
    hasPromise: promises.length > 0,
    isLoading,
  };
};
