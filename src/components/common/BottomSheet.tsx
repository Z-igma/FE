import { useState } from 'react';

type BottomSheetProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  peekHeight?: string; // 닫았을 때 높이
  fullHeight?: string; // 열었을 때 높이
  className?: string;
};

const BottomSheet = ({
  children,
  isOpen,
  onClose,
  peekHeight = 'h-17',
  fullHeight = 'h-90',
  className,
}: BottomSheetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpen = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bottom-23.5">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white rounded-t-2xl transition-all duration-300 ${
          isExpanded ? fullHeight : peekHeight
        } ${!isExpanded ? 'overflow-hidden' : ''}`}
      >
        <div
          className="flex justify-center pt-3 pb-2 cursor-pointer"
          onClick={handleOpen}
        >
          <div className="w-22.5 h-1 bg-[#DDDDDD] rounded-full" />
        </div>

        <div className={`overflow-y-auto ${className}`}>{children}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
