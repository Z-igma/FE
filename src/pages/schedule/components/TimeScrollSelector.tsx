import { useEffect, useRef, useState } from 'react';

// 선택값과의 거리에 따른 크기 및 색상 차이
const getItemStyle = (diff: number) => {
  if (diff === 0) return 'text-[1.25rem] text-[#16191C]';
  if (diff === 1) return 'text-[1.125rem] text-[#AEAEAE]';
  if (diff === 2) return 'text-[0.875rem] text-[#C2C2C2]';
  return 'text-[0.75rem] text-[#D7D7D7]';
};

const divisionTime = ['AM', 'PM'];
const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0'),
);

export interface TimeIndex {
  ap: number;
  hr: number;
  mn: number;
}

interface TimeScrollSelectorProps {
  initialIndex?: TimeIndex;
  onChange?: (time: string, index: TimeIndex) => void;
}

interface PickerColumnProps {
  items: string[];
  value: number;
  onChange: (index: number) => void;
}

const PickerColumn = ({ items, value, onChange }: PickerColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({
      top: value * 28,
      behavior: 'auto',
    });
  }, [value]);

  // 스크롤 위치 기준으로 가장 가까운 아이템 인덱스 전달
  const handleScroll = () => {
    if (!ref.current) return;
    const next = Math.round(ref.current.scrollTop / 28);
    const clamped = Math.min(Math.max(next, 0), items.length - 1);
    if (clamped !== value) onChange(clamped);
  };

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      className="h-45 w-8 snap-y snap-mandatory overflow-y-scroll"
    >
      <div className="h-19" />
      {items.map((item, index) => (
        <p
          key={item}
          className={`${getItemStyle(Math.abs(index - value))} h-7 snap-center text-center font-[SF-Pro] leading-4`}
        >
          {item}
        </p>
      ))}
      <div className="h-19" />
    </div>
  );
};

const TimeScrollSelector = ({
  initialIndex = { ap: 1, hr: 5, mn: 30 },
  onChange,
}: TimeScrollSelectorProps) => {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const { ap, hr, mn } = index;
    onChange?.(
      `${divisionTime[ap] === 'AM' ? '오전' : '오후'} ${hours[hr]}시 ${minutes[mn]}분`,
      index,
    );
  }, [index, onChange]);

  const updateIndex = (key: keyof TimeIndex, value: number) => {
    setIndex(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative flex w-full justify-center gap-7 rounded-[20px] bg-[rgba(224,224,224,0.50)] px-6 py-2">
      {/* 선택값 위아래 구분선 */}
      <div className="pointer-events-none absolute top-19 h-[0.5px] w-full bg-[#CCCCCC]" />
      <div className="pointer-events-none absolute top-27 h-[0.5px] w-full bg-[#CCCCCC]" />

      <PickerColumn
        items={divisionTime}
        value={index.ap}
        onChange={value => updateIndex('ap', value)}
      />
      <PickerColumn
        items={hours}
        value={index.hr}
        onChange={value => updateIndex('hr', value)}
      />
      <PickerColumn
        items={minutes}
        value={index.mn}
        onChange={value => updateIndex('mn', value)}
      />
    </div>
  );
};

export default TimeScrollSelector;
