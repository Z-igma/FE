import { useState } from 'react';
import Header from '@/components/layout/Header';
import CreateScheduleTitle from './components/CreateScheduleTitle';
import DropdownIcon from '@/assets/images/dropdownIcon.svg';
import DatePickerCalendar from './components/DatePickerCalendar';

const CreateScheduleForm = () => {
  const [isMultiVote, setIsMultiVote] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜 표시 포맷 함수
  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = DAYS[date.getDay()];
    return `${month}월 ${day}일 (${dayOfWeek})`;
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsDateOpen(false);
  };

  return (
    <div>
      <Header title="새 약속 만들기" />
      <div className="flex flex-col pt-5 px-4 gap-5">
        <div className="flex flex-col gap-2">
          <CreateScheduleTitle title="약속명" />
          <input
            placeholder="약속명을 입력해 주세요"
            className="px-3 py-3.75 bg-[#FAFAFA] border border-[#C6C6C6] rounded-[10px] text-[#111111] placeholder:text-[#C6C6C6] font-Pretendard text-[0.875rem] font-medium leading-5 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <CreateScheduleTitle title="날짜 · 시간" />
          {/* 날짜 선택 토글 */}
          <div className="flex justify-between">
            <div
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="flex justify-between items-center w-43 px-2.5 py-3.75 bg-[#FAFAFA] border border-[#C6C6C6] rounded-[10px] cursor-pointer caret-transparent focus:outline-none"
            >
              <p
                className={`font-Pretendard text-[0.875rem] font-medium leading-5 ${
                  selectedDate ? 'text-[#111111]' : 'text-[#C6C6C6]'
                }`}
              >
                {selectedDate
                  ? formatDate(selectedDate)
                  : '날짜를 선택해 주세요'}
              </p>
              <img
                src={DropdownIcon}
                className={`transition-transform duration-200 ${isDateOpen ? 'rotate-180' : ''}`}
              />
            </div>
            {/* 시간 선택 토글 */}
            <div
              onClick={() => setIsTimeOpen(!isTimeOpen)}
              className="flex justify-between items-center w-43 px-2.5 py-3.75 bg-[#FAFAFA] border border-[#C6C6C6] rounded-[10px] cursor-pointer caret-transparent focus:outline-none"
            >
              <p className="font-Pretendard text-[0.875rem] font-medium leading-5 text-[#C6C6C6]">
                시간을 선택해 주세요
              </p>
              <img
                src={DropdownIcon}
                className={`transition-transform duration-200 ${isTimeOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
          {isDateOpen && (
            <div className="px-10.5 mt-3 mb-5 bg-[rgba(224, 224, 224, 0.50)]">
              {/* 날짜 선택 캘린더 추가 */}
              <DatePickerCalendar
                selectedDate={selectedDate}
                setSelectedDate={handleSelectDate}
              />
            </div>
          )}
          {isTimeOpen && (
            <div className="mt-1 mb-5 bg-[rgba(224, 224, 224, 0.50)]">
              {/* 시간 선택 추가 */}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <CreateScheduleTitle title="약속 주제" />
        </div>

        <div className="flex justify-between items-center">
          <CreateScheduleTitle title="참여자 초대" />
          <button className="py-1 px-4 border bg-[#FAFAFA] border-[#C6C6C6] rounded-[10px] active:bg-[#00408E]">
            <p className="text-[0.875rem] font-Pretendard text-[#C6C6C6] font-light leading-5 active:text-[#FFFFFF]">
              공유하기
            </p>
          </button>
        </div>

        <div className="flex justify-between">
          <CreateScheduleTitle title="장소 복수 투표" />
          <div
            onClick={() => setIsMultiVote(!isMultiVote)}
            className={`w-13.5 h-7.5 px-1.25 py-1.5 border rounded-4xl cursor-pointer transition-colors border-[#C6C6C6] ${isMultiVote ? 'bg-[#00408E]' : 'bg-[#FAFAFA]'}`}
          >
            <div
              className={`w-4.5 h-4.5 rounded-4xl transition-transform ${isMultiVote ? 'bg-[#FFFFFF] translate-x-6' : 'bg-[#D9D9D9]'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleForm;
