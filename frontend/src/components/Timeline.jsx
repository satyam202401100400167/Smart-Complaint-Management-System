import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { formatDate } from '../utils/helpers.js';
import StatusBadge from './StatusBadge.jsx';

const Timeline = ({ entries = [] }) => {
  if (!entries.length) return null;

  return (
    <div className="card">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Clock className="h-5 w-5 text-indigo-400" />
        Complaint Timeline
      </h3>
      <div className="relative space-y-0">
        {entries.map((entry, index) => (
          <motion.div
            key={entry._id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {index < entries.length - 1 && (
              <div className="absolute left-[7px] top-4 h-full w-px bg-zinc-700" />
            )}
            <motion.div className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-indigo-500 bg-zinc-900" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={entry.status} />
                <span className="text-xs text-zinc-500">{formatDate(entry.updatedAt)}</span>
              </div>
              {entry.note && <p className="mt-1 text-sm text-zinc-400">{entry.note}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
