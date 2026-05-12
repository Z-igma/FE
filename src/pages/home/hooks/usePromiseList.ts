import { usePromises } from '../services/usePromises';

// 약속 상태 정렬 순서 진행 중 > 장소 미정 > 확정 완료
const STATUS_ORDER: Record<string, number> = {
  '장소 미정': 0,
  '진행 중': 1,
  '장소 확정': 2,
};

// 약속 날짜 형식 변환
export const formatDate = (promisedAt: string, dayOfWeek: string) => {
  const date = new Date(promisedAt);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const time = promisedAt.split('T')[1].slice(0, 5);
  return `${month}월 ${day}일 (${dayOfWeek}) ${time}`;
};

// 상태 → 날짜 오름차순 정렬
const sortPromises = <T extends { promiseStatus: string; promisedAt: string }>(
  promises: T[],
): T[] =>
  [...promises].sort((a, b) => {
    const statusDiff =
      (STATUS_ORDER[a.promiseStatus] ?? 99) -
      (STATUS_ORDER[b.promiseStatus] ?? 99);
    if (statusDiff !== 0) return statusDiff;
    return new Date(a.promisedAt).getTime() - new Date(b.promisedAt).getTime();
  });

// 약속 목록 진행 중 / 지난 약속 분류 반환
export const usePromiseList = () => {
  const { data, isLoading } = usePromises();
  const now = new Date();

  const promises = data?.data.promises ?? [];

  const activePromises = sortPromises(
    promises.filter(promise => new Date(promise.promisedAt) >= now),
  );

  const pastPromises = sortPromises(
    promises.filter(promise => new Date(promise.promisedAt) < now),
  );

  return {
    promises,
    activePromises,
    pastPromises,
    hasPromise: promises.length > 0,
    isLoading,
  };
};