// 오후 6시 00분 > 18:00:00
export const parseTimeLabel = (timeStr: string): string => {
  const match = timeStr.match(/(\d+)시\s*(\d+)분/);
  if (!match) return '00:00:00';
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  if (timeStr.includes('오후') && hours !== 12) hours += 12;
  if (timeStr.includes('오전') && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
};

// Date 객체 > 2026-05-05
export const formatDateToISO = (date: Date): string =>
  date.toISOString().slice(0, 10);
