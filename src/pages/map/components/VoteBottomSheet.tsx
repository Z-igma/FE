import type { Marker } from '@/types/map';
import VoteStateBox from './VoteStateBox';
import BottomButton from '@/components/common/BottomButton';
import BottomSheet from '@/components/common/BottomSheet';

interface VoteBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  count: number; // 투표 중인 장소 수
  promiseId: string | undefined;
  promise: any; // 타입 지정 예정
  onGoResult: () => void; // 장소 결정하기 버튼 핸들러
  markers: Marker[];
  votedPlaces: string[]; // 복수 투표된 장소 키 목록
  votedPlace: string | null; // 단일 투표된 장소 키
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
  // 마커별 득표 수 계산
  const getVoteCount = (marker: Marker): number => {
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
