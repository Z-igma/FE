import WarningIcon from '@/assets/images/warningIcon.svg';

const NotFound = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center bg-[#00408E] gap-10">
      <div className="flex flex-col items-center justify-center">
        <img src={WarningIcon} />
        <p className="font-Pretendard font-semibold text-[1.5rem] text-[#FFFFFF]">
          404 Not Found
        </p>
        <p className="font-Pretendard font-medium text-[1rem] text-[#FFFFFF]">
          요청하신 페이지를 찾을 수 없습니다
        </p>
      </div>
      <button className="px-3 py-2 border border-[#FFFFFF] rounded-[10px]">
        <p className="font-Pretendard font-medium text-[0.75rem] text-[#FFFFFF]">
          메인으로
        </p>
      </button>
    </div>
  );
};

export default NotFound;
