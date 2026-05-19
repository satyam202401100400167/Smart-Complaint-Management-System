import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No data found', description = 'Try adjusting your filters or create a new entry.', action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-16 text-center"
    >
      <div className="mb-4 rounded-full bg-zinc-800 p-4">
        <Inbox className="h-10 w-10 text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-200">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
