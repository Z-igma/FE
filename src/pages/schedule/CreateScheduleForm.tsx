import { useState } from 'react';
import Header from '@/components/layout/Header';
import CreateScheduleTitle from './components/CreateScheduleTitle';
import DropdownIcon from '@/assets/images/dropdownIcon.svg';
import DatePickerCalendar from './components/DatePickerCalendar';
import TimeScrollSelector, {
  type TimeIndex,
} from './components/TimeScrollSelector';
import BottomButton from '@/components/common/BottomButton';
import { useNavigate } from 'react-router-dom';

const TOPICS = ['식사', '카페', '영화', '액티비티', '스터디', '파티'];

const getNowIndex = (): TimeIndex => {
  const now = new Date();
  const hours12 = now.getHours() % 12;
  return {
    ap: now.getHours() >= 12 ? 1 : 0,
    hr: hours12 === 0 ? 11 : hours12 - 1,
    mn: now.getMinutes(),
  };
};

const CreateScheduleForm = () => {
  const navigate = useNavigate();

  const [scheduleName, setScheduleName] = useState('');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [timeIndex, setTimeIndex] = useState<TimeIndex>(getNowIndex); // 지금 시간을 기본 값으로 설정
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isMultiVote, setIsMultiVote] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [touched, setTouched] = useState({
    scheduleName: false,
    date: false,
    time: false,
    topic: false,
  });

  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜 표시 포맷 함수
  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = DAYS[date.getDay()];
    return `${month}월 ${day}일 (${dayOfWeek})`;
  };

  const isValid =
    !!scheduleName && !!selectedDate && !!selectedTime && !!selectedTopic;

  const handleSubmit = () => {
    navigate('/home');
  };

  return (
    <div>
      <Header title="새 약속 만들기" />
      <div className="flex flex-col pt-5 px-4 gap-5">
        <div className="flex flex-col gap-2">
          <CreateScheduleTitle
            title="약속명"
            error={touched.scheduleName && !scheduleName}
          />
          <input
            value={scheduleName}
            onChange={e => setScheduleName(e.target.value)}
            placeholder="약속명을 입력해 주세요"
            className={`px-3 py-3.75 border rounded-[10px] text-[#111111] placeholder:text-[#C6C6C6] font-Pretendard text-[0.875rem] font-medium leading-5 focus:outline-none ${
              touched.scheduleName && !scheduleName
                ? 'bg-[rgba(255,9,9,0.10)] border-[#FF0909]'
                : 'bg-[#FAFAFA] border-[#C6C6C6]'
            }`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <CreateScheduleTitle
            title="날짜 · 시간"
            error={
              (touched.date && !selectedDate) || (touched.time && !selectedTime)
            }
          />
          {/* 날짜 선택 드롭다운 */}
          <div className="flex gap-4">
            <div
              onClick={() => {
                setTouched(prev => ({ ...prev, scheduleName: true }));
                setIsDateOpen(!isDateOpen);
              }}
              className={`flex flex-1 justify-between items-center px-2.5 py-3.75 border rounded-[10px] cursor-pointer ${
                touched.date && !selectedDate
                  ? 'bg-[rgba(255,9,9,0.10)] border-[#FF0909]'
                  : 'bg-[#FAFAFA] border-[#C6C6C6]'
              }`}
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
            {/* 시간 선택 드롭다운 */}
            <div
              onClick={() => {
                setTouched(prev => ({
                  ...prev,
                  scheduleName: true,
                  date: true,
                }));
                setIsTimeOpen(!isTimeOpen);
              }}
              className={`flex flex-1 justify-between items-center px-2.5 py-3.75 border rounded-[10px] cursor-pointer ${
                touched.time && !selectedTime
                  ? 'bg-[rgba(255,9,9,0.10)] border-[#FF0909]'
                  : 'bg-[#FAFAFA] border-[#C6C6C6]'
              }`}
            >
              <p
                className={`font-Pretendard text-[0.875rem] font-medium leading-5 ${
                  selectedTime ? 'text-[#111111]' : 'text-[#C6C6C6]'
                }`}
              >
                {selectedTime ?? '시간을 선택해 주세요'}
              </p>
              <img
                src={DropdownIcon}
                className={`transition-transform duration-200 ${isTimeOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
          {isDateOpen && (
            <div className="px-10.5 mt-3 mb-5 bg-[rgba(224, 224, 224, 0.50)]">
              {/* 날짜 선택 캘린더 */}
              <DatePickerCalendar
                selectedDate={selectedDate}
                setSelectedDate={date => {
                  setSelectedDate(date);
                  setIsDateOpen(false);
                }}
              />
            </div>
          )}
          {isTimeOpen && (
            <div className="mt-1 mb-5 bg-[rgba(224, 224, 224, 0.50)]">
              {/* 시간 선택 */}
              <TimeScrollSelector
                initialIndex={timeIndex}
                onChange={(time, index) => {
                  setSelectedTime(time);
                  setTimeIndex(index);
                }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <CreateScheduleTitle
            title="약속 주제"
            error={touched.topic && !selectedTopic}
          />
          <div className="grid grid-cols-3 gap-2.5">
            {TOPICS.map(topic => (
              <div
                key={topic}
                onClick={() => {
                  setTouched(prev => ({
                    ...prev,
                    scheduleName: true,
                    date: true,
                    time: true,
                    topic: true,
                  }));
                  setSelectedTopic(prev => (prev === topic ? null : topic));
                }}
                className={`flex justify-center items-center py-3.75 border border-[#C6C6C6] rounded-[10px] cursor-pointer ${
                  selectedTopic === topic ? 'bg-[#00408E]' : 'bg-[#FAFAFA] '
                }`}
              >
                <p
                  className={`text-[0.875rem] font-Pretendard text-[#C6C6C6] leading-5 ${
                    selectedTopic === topic ? 'font-semibold' : 'font-light'
                  }`}
                >
                  {topic}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <CreateScheduleTitle title="참여자 초대" />
          <button
            onClick={() => {
              setTouched({
                scheduleName: true,
                date: true,
                time: true,
                topic: true,
              });
            }}
            className="py-1 px-4 border bg-[#FAFAFA] border-[#C6C6C6] rounded-[10px] active:bg-[#00408E]"
          >
            <p className="text-[0.875rem] font-Pretendard text-[#C6C6C6] font-light leading-5 active:text-[#FFFFFF]">
              공유하기
            </p>
          </button>
        </div>

        <div className="flex justify-between">
          <CreateScheduleTitle title="장소 복수 투표" />
          <div
            onClick={() => {
              setTouched({
                scheduleName: true,
                date: true,
                time: true,
                topic: true,
              });
              setIsMultiVote(!isMultiVote);
            }}
            className={`w-13.5 h-7.5 px-1.25 py-1.5 border rounded-4xl cursor-pointer transition-colors border-[#C6C6C6] ${isMultiVote ? 'bg-[#00408E]' : 'bg-[#FAFAFA]'}`}
          >
            <div
              className={`w-4.5 h-4.5 rounded-4xl transition-transform ${isMultiVote ? 'bg-[#FFFFFF] translate-x-6' : 'bg-[#D9D9D9]'}`}
            />
          </div>
        </div>
      </div>

      <BottomButton text="만들기" disabled={!isValid} onClick={handleSubmit} />
    </div>
  );
};

export default CreateScheduleForm;
