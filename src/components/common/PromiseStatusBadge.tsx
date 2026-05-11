const STATUS_CONFIG: Record<
  string,
  { dot: string; badge: string; label: string }
> = {
  '장소 미정': {
    dot: 'bg-[#FFFFFF]',
    badge: 'bg-[#B2B2B2] text-[#FFFFFF]',
    label: '장소 미정',
  },
  '진행 중': {
    dot: 'bg-[#2E7D32]',
    badge: 'bg-[#E8F5E9] text-[#2E7D32]',
    label: '진행 중',
  },
  '확정 완료': {
    dot: 'bg-[#FFFFFF]',
    badge: 'bg-[#646464] text-[#FFFFFF]',
    label: '확정 완료',
  },
};

interface PromiseStatusBadgeProps {
  status?: string;
}

const PromiseStatusBadge = ({ status }: PromiseStatusBadgeProps) => {
    if (!status) return null;

  const config = STATUS_CONFIG[status] ?? {
    dot: 'bg-[#B2B2B2]',
    badge: 'bg-[#B2B2B2] text-[#FFFFFF]',
    label: status ?? '',
  };

  return (
    <div
      className={`flex items-center gap-1.5 py-1.5 px-1.75 rounded-full ${config.badge}`}
    >
      {status !== '확정 완료' && (
        <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
      )}
      <p className="font-Pretendard font-semibold text-[0.75rem] leading-4.2">
        {config.label}
      </p>
    </div>
  );
};

export default PromiseStatusBadge;
