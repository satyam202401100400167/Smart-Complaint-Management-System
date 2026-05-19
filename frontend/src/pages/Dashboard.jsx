import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, Plus, ArrowRight } from 'lucide-react';
import { getComplaints } from '../api/complaintApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getErrorMessage, formatDate, truncate } from '../utils/helpers.js';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getComplaints({ limit: 5 });
        setComplaints(data.data);
        const all = data.total || data.data.length;
        setStats({
          total: all,
          pending: data.data.filter((c) => c.status === 'Pending').length,
          resolved: data.data.filter((c) => c.status === 'Resolved').length,
        });
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  if (loading) return <LoadingSpinner size="lg" className="min-h-[40vh]" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-zinc-400">Overview of your complaint activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Complaints" value={stats.total} icon={FileText} delay={0} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="amber" delay={0.1} />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="emerald" delay={0.2} />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Recent Complaints</h2>
        <Link to="/complaints/new" className="btn-primary py-2 text-sm">
          <Plus className="h-4 w-4" /> New Complaint
        </Link>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          title="No complaints yet"
          description="Register your first complaint to get AI-powered analysis and tracking."
          action={
            <Link to="/complaints/new" className="btn-primary">
              Register Complaint
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {complaints.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/complaints/${c._id}`}
                className="card flex flex-col gap-3 transition hover:border-indigo-500/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-white">{c.title}</h3>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{truncate(c.description, 80)}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {c.category} &bull; {c.location} &bull; {formatDate(c.createdAt)}
                  </p>
                </div>
                <ArrowRight className="hidden h-5 w-5 text-zinc-500 sm:block" />
              </Link>
            </motion.div>
          ))}
          <Link to="/complaints" className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300">
            View all complaints <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
