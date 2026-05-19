import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants.js';

const StatusBadge = ({ status, type = 'status' }) => {
  const colors =
    type === 'priority'
      ? PRIORITY_COLORS[status] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
      : STATUS_COLORS[status] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
