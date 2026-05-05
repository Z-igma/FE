import { useNavigate } from 'react-router-dom';
import CreatePromiseTitle from './components/CreatePromiseTitle';
import DatePickerCalendar from './components/DatePickerCalendar';
import TimeScrollSelector from './components/TimeScrollSelector';
import Header from '@/components/layout/Header';
import BottomButton from '@/components/common/BottomButton';
import { formatDateLabel, useCreatePromise } from './hooks/useCreatePromise';
import { CATEGORIES } from './constants/promise';
import DropdownIcon from '@/assets/images/dropdownIcon.svg';
import FixBottomLayout from '@/components/layout/FixBottomLayout';
import { useCreatePromiseMutation } from './services/useCreatePromiseMutation';
import { formatDateToISO, parseTimeLabel } from '@/utils/formatDateTime';

const CreatePromiseForm = () => {
  const navigate = useNavigate();
  const {
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
  } = useCreatePromise();
  const { mutate } = useCreatePromiseMutation();

  const handleSubmit = () => {
    const promisedAt = `${formatDateToISO(selectedDate!)}T${parseTimeLabel(selectedTime!)}`;

    mutate(
      {
        title: promiseName,
        promisedAt,
        category: selectedCategory!,
        isMultipleVoting: isMultiVote,
      },
      {
        onSuccess: () => navigate(`/home`),
      },
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="새 약속 만들기" />
      <div className="flex flex-col pt-5 px-4 gap-5 overflow-y-auto pb-50">
        <div className="flex flex-col gap-2">
          <CreatePromiseTitle
            title="약속명"
            error={showErrors.promiseName && promiseName.trim() === ''}
          />
          <input
            value={promiseName}
            onChange={e => setPromiseName(e.target.value)}
            placeholder="약속명을 입력해 주세요"
            className={`px-3 py-3.75 border rounded-[10px] text-[#111111] placeholder:text-[#C6C6C6] font-Pretendard text-[0.875rem] font-medium leading-5 focus:outline-none ${
              showErrors.promiseName && promiseName.trim() === ''
                ? 'bg-[rgba(255,9,9,0.10)] border-[#FF0909]'
                : 'bg-[#FAFAFA] border-[#C6C6C6]'
            }`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <CreatePromiseTitle
            title="날짜 · 시간"
            error={
              (showErrors.date && !selectedDate) ||
              (showErrors.time && !selectedTime)
            }
          />
          <div className="flex gap-4">
            {/* 날짜 선택 드롭다운 */}
            <div
              onClick={() => {
                setShowErrors(prev => ({ ...prev, promiseName: true }));
                setIsTimeOpen(false);
                setIsDateOpen(!isDateOpen);
              }}
              className={`flex flex-1 justify-between items-center px-2.5 py-3.75 border rounded-[10px] cursor-pointer ${
                showErrors.date && !selectedDate
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
                  ? formatDateLabel(selectedDate)
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
                setShowErrors(prev => ({
                  ...prev,
                  promiseName: true,
                  date: true,
                }));
                setIsDateOpen(false);
                setIsTimeOpen(!isTimeOpen);
              }}
              className={`flex flex-1 justify-between items-center px-2.5 py-3.75 border rounded-[10px] cursor-pointer ${
                showErrors.time && !selectedTime
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
          <CreatePromiseTitle
            title="약속 주제"
            error={showErrors.category && !selectedCategory}
          />
          <div className="grid grid-cols-3 gap-2.5">
            {CATEGORIES.map(category => (
              <div
                key={category}
                onClick={() => {
                  setShowErrors(prev => ({
                    ...prev,
                    promiseName: true,
                    date: true,
                    time: true,
                    category: true,
                  }));
                  setSelectedCategory(prev =>
                    prev === category ? null : category,
                  );
                }}
                className={`flex justify-center items-center py-3.75 border border-[#C6C6C6] rounded-[10px] cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-[#00408E]'
                    : 'bg-[#FAFAFA]'
                }`}
              >
                <p
                  className={`text-[0.875rem] font-Pretendard text-[#C6C6C6] leading-5 ${
                    selectedCategory === category
                      ? 'font-semibold'
                      : 'font-light'
                  }`}
                >
                  {category}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <CreatePromiseTitle title="참여자 초대" />
          <button
            onClick={showAllErrors}
            className="py-1 px-4 border bg-[#FAFAFA] border-[#C6C6C6] rounded-[10px] active:bg-[#00408E]"
          >
            <p className="text-[0.875rem] font-Pretendard text-[#C6C6C6] font-light leading-5 active:text-[#FFFFFF]">
              공유하기
            </p>
          </button>
        </div>

        <div className="flex justify-between">
          <CreatePromiseTitle title="장소 복수 투표" />
          <div
            onClick={() => {
              showAllErrors();
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

      <FixBottomLayout>
        <BottomButton
          text="만들기"
          disabled={!isValid}
          onClick={handleSubmit}
        />
      </FixBottomLayout>
    </div>
  );
};

export default CreatePromiseForm;
