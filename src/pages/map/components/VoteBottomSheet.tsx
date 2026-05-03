import VoteStateBox from './VoteStateBox';
import BottomButton from '@/components/common/BottomButton';
import BottomSheet from '@/components/common/BottomSheet';

interface VoteBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
  promiseId: string | undefined;
  promise: any;
  onGoResult: () => void;
  markers: Marker[];
  votedPlaces: string[];
  votedPlace: string | null;
}

interface Marker {
  lat: number;
  lng: number;
  placeName: string;
  address: string;
}

const VoteBottomSheet = ({
  isOpen,
  onClose,
  count,
  promise,
  onGoResult,
  markers,
  votedPlaces,
  votedPlace,
}: VoteBottomSheetProps) => {
  const getVoteCount = (marker: Marker) => {
    const key = `${marker.lat}_${marker.lng}`;
    if (promise?.isMultipleVoting) {
      return votedPlaces.filter(k => k === key).length;
    }
    return votedPlace === key ? 1 : 0;
  };

  const maxVote = Math.max(...markers.map(m => getVoteCount(m)), 0);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      fullHeight="h-90"
      className="flex flex-col gap-5 pt-2 px-5 h-full"
    >
      <p className="text-[#111111] font-Pretendard font-semibold text-[1.375rem] leading-7.7">
        투표 중인 장소 {count}곳
      </p>
      <div className="flex flex-col overflow-y-auto min-h-45 max-h-45 gap-2.5">
        {/* 투표 내용 임시 */}
        {markers.map((marker, i) => {
          const vote = getVoteCount(marker);
          return (
            <VoteStateBox
              key={i}
              isBest={vote === maxVote && maxVote > 0}
              name={marker.placeName}
              distance={marker.address}
              vote={vote}
            />
          );
        })}
      </div>
      <BottomButton text="장소 결정하기" textSize="1rem" onClick={onGoResult} />
    </BottomSheet>
  );
};

export default VoteBottomSheet;
