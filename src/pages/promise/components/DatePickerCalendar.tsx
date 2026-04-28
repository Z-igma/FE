import { useState } from 'react';
import CalendarBackIcon from '@/assets/images/calendarBackIcon.svg';
import CalendarNextIcon from '@/assets/images/calendarNextIcon.svg';

interface DatePickerCalendarProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const DatePickerCalendar = ({
  selectedDate,
  setSelectedDate,
}: DatePickerCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 현재 달의 첫 날
  const firstDayOfMonth = new Date(year, month, 1);
  // 달력 시작 날짜를 현재 달의 첫 날의 주의 일요일로 설정
  const startDay = new Date(firstDayOfMonth);
  const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // 월 = 0, 화 = 1, ... 일 = 6
  startDay.setDate(1 - firstDayOfWeek);

  // 현재 달의 마지막 날
  const lastDayOfMonth = new Date(year, month + 1, 0);
  // 달력 끝 날짜를 현재 달의 마지막 날의 주의 토요일로 설정
  const endDay = new Date(lastDayOfMonth);
  const lastDayOfWeek = (lastDayOfMonth.getDay() + 6) % 7;
  endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfWeek));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 시작부터 끝까지의 날짜를 주 단위로 그룹화
  const groupDatesByWeek = (startDay: Date, endDay: Date) => {
    const weeks = []; // 최종적 날짜 배열 저장
    let currentWeek = []; // 현재 처리 중인 주를 나타내는 배열
    let currentDate = new Date(startDay); // 반복 처리를 위한 현재 날짜 변수, 시작 날짜로 초기화

    // 시작 날짜부터 끝 날짜까지 반복
    while (currentDate <= endDay) {
      currentWeek.push(new Date(currentDate)); // 현재 날짜를 현재 주에 추가
      // 현재 주가 7일을 모두 채웠거나 현재 날짜가 토요일인 경우
      if (currentWeek.length === 7 || currentDate.getDay() === 0) {
        weeks.push(currentWeek); // 완성된 주를 weeks 배열에 추가
        currentWeek = []; // 새로운 주를 시작하기 위해 재초기화
      }
      currentDate.setDate(currentDate.getDate() + 1); // 현재 날짜를 다음 날로 변경
    }

    // 남아 있을 경우 마지막 주 처리
    if (currentWeek.length > 0) {
      weeks.push(currentWeek); // 남아 있는 날짜가 있다면 마지막 주로 추가
    }

    return weeks; // 주 단위로 그룹화된 날짜 배열 반환
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  return (
    <div className="flex flex-col gap-4 pt-6 pb-5 px-6 bg-[#FFFFFF]  shadow-[8px_3px_22px_10px_rgba(150,150,150,0.11)] rounded-2xl">
      <div className="flex justify-between">
        <p className="font-Pretendard text-[#0F2552] text-[0.875rem] font-semibold leading-5">
          {year}년 {month + 1}월
        </p>
        <div className="flex items-center gap-6">
          <img src={CalendarBackIcon} onClick={handlePrevMonth} />
          <img src={CalendarNextIcon} onClick={handleNextMonth} />
        </div>
      </div>
      <div className="w-full h-[0.8px] bg-[#E4E5E7]" />
      <div className="flex flex-col gap-4">
        {/* 요일 */}
        <div className="grid grid-cols-7 text-center">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
            <p
              key={day}
              className="flex items-center justify-center w-7 h-7 font-[SF-Pro] text-[0.625rem] text-[#7E818C] font-medium"
            >
              {day}
            </p>
          ))}
        </div>

        {/* 날짜 */}
        <div className="flex flex-col gap-4">
          {groupDatesByWeek(startDay, endDay).map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 text-center">
              {week.map((date, dateIdx) => {
                const isPast = date < today;
                const isSelected = selectedDate?.getTime() === date.getTime();
                const isCurrentMonth = date.getMonth() === month;

                return (
                  <p
                    key={dateIdx}
                    onClick={() => {
                      if (isPast) return;
                      setSelectedDate(isSelected ? null : date);
                    }}
                    className={`flex items-center justify-center w-7 h-7 text-center font-[SF-Pro] text-[0.875rem] font-medium ${
                      !isCurrentMonth
                        ? 'invisible'
                        : isSelected
                          ? 'text-[#FDFDFD] bg-[#00408E] rounded-full'
                          : isPast
                            ? 'text-[#C6C6C6] cursor-default'
                            : 'text-[#0F2552]'
                    }`}
                  >
                    {date.getDate()}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatePickerCalendar;
