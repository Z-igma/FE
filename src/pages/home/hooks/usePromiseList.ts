// 교체 예정 임시 데이터
const mockPromises = [
  {
    id: 1,
    title: '저녁 모임',
    planStatus: '진행 중',
    promisedAt: '2026-05-28T21:26:12',
    dayOfWeek: '목',
    memberCount: 3,
  },
  {
    id: 2,
    title: '영화',
    planStatus: '확정 완료',
    promisedAt: '2026-04-25T21:26:12',
    dayOfWeek: '토',
    memberCount: 1,
  },
];

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
  const promises = mockPromises;
  const now = new Date();

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
  };
};
