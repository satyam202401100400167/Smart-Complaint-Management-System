import { motion } from 'framer-motion';
import { Brain, Building2, FileText, MessageSquare, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

const AIAnalysisCard = ({ analysis }) => {
  if (!analysis?.summary && !analysis?.priority) {
    return null;
  }

  const items = [
    { icon: AlertTriangle, label: 'Priority', value: analysis.priority, badge: true },
    { icon: Building2, label: 'Department', value: analysis.department },
    { icon: FileText, label: 'Summary', value: analysis.summary },
    { icon: MessageSquare, label: 'Auto Response', value: analysis.autoResponse },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-zinc-900"
    >
      <div className="mb-4 flex items-center gap-2">
        <Brain className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
      </div>
      <div className="space-y-4">
        {items.map((item) =>
          item.value ? (
            <div key={item.label} className="flex gap-3">
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {item.label}
                </p>
                {item.badge ? (
                  <div className="mt-1">
                    <StatusBadge status={item.value} type="priority" />
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-zinc-300">{item.value}</p>
                )}
              </div>
            </div>
          ) : null
        )}
      </div>
    </motion.div>
  );
};

export default AIAnalysisCard;
