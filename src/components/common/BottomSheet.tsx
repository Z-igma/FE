import { useState } from 'react';

type BottomSheetProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  peekHeight?: string;
  fullHeight?: string;
  className?: string;
};

const BottomSheet = ({
  children,
  isOpen,
  // onClose,
  peekHeight = 'h-17',
  fullHeight = 'h-90',
  className,
}: BottomSheetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpen = () => {
    setIsExpanded(prev => !prev);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className={`absolute bottom-[5.5rem] left-0 w-full bg-white rounded-t-2xl transition-all duration-300 pointer-events-auto ${
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
