import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', delay = 0 }) => {
  const colorMap = {
    indigo: 'from-indigo-600/20 to-indigo-600/5 border-indigo-500/30 text-indigo-400',
    emerald: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-600/20 to-amber-600/5 border-amber-500/30 text-amber-400',
    red: 'from-red-600/20 to-red-600/5 border-red-500/30 text-red-400',
    blue: 'from-blue-600/20 to-blue-600/5 border-blue-500/30 text-blue-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`card bg-gradient-to-br ${colorMap[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-lg bg-zinc-800/80 p-3">
            <Icon className={`h-6 w-6 ${colorMap[color].split(' ').pop()}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
