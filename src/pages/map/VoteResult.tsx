import Header from '@/components/layout/Header';
import { useLocation } from 'react-router-dom';

const VoteResult = () => {
  const { state } = useLocation();
  const promise = state?.promise; // 약속 정보

  return (
    <div>
      <Header title="장소 결정" />
    </div>
  );
};

export default VoteResult;
