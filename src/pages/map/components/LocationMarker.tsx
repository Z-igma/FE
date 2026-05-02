import MapLogoIcon from '@/assets/images/map/mapLogoIcon.svg';

interface LocationMarkerProps {
  name: string;
  onClick?: () => void;
}

const LocationMarker = ({ name, onClick }: LocationMarkerProps) => {
  return (
    <div
      onClick={onClick}
      className="relative inline-flex justify-center items-center px-3 h-[2.15rem] bg-[#00408E] rounded-[7px] gap-2 cursor-pointer after:content-[''] after:absolute after:left-0.75 after:bottom-[-0.3rem] after:w-4 after:h-4 after:bg-[#00408E] after:rotate-60 after:shadow-[0_1px_0_rgba(0,0,0,0.04)]"
    >
      <img src={MapLogoIcon} className="z-10" />
      <p className="text-[#FFFFFF] font-Pretendard text-[0.75rem] font-semibold leading-4 whitespace-nowrap">
        {name}
      </p>
    </div>
  );
};

export default LocationMarker;
