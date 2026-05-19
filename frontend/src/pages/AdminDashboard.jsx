import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Download,
} from 'lucide-react';
import { getAnalytics, exportCSV } from '../api/complaintApi.js';
import { useToast } from '../context/ToastContext.jsx';
import { getErrorMessage } from '../utils/helpers.js';
import StatCard from '../components/StatCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const AdminDashboard = () => {
  const toast = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await getAnalytics();
        setAnalytics(data.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [toast]);

  const handleExport = async () => {
    try {
      const { data } = await exportCSV();
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'complaints-export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[40vh]" />;

  const statusMap = Object.fromEntries(
    (analytics?.byStatus || []).map((s) => [s._id, s.count])
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Dashboard</h1>
          <p className="text-zinc-400">Complaint analytics and system overview</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport} className="btn-secondary py-2 text-sm">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <Link to="/complaints" className="btn-primary py-2 text-sm">
            Manage Complaints
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Complaints" value={analytics?.total || 0} icon={FileText} />
        <StatCard title="This Week" value={analytics?.recentWeek || 0} icon={TrendingUp} color="blue" />
        <StatCard title="Pending" value={statusMap.Pending || 0} icon={Clock} color="amber" />
        <StatCard title="Resolved" value={statusMap.Resolved || 0} icon={CheckCircle} color="emerald" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-white">By Status</h3>
          <div className="space-y-3">
            {(analytics?.byStatus || []).map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-zinc-400">{item._id}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${analytics.total ? (item.count / analytics.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-white">{item.count}</span>
                </div>
              </div>
            ))}
            {!analytics?.byStatus?.length && (
              <p className="text-sm text-zinc-500">No data yet</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-white">By Category</h3>
          <div className="space-y-3">
            {(analytics?.byCategory || []).map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-zinc-400">{item._id}</span>
                <span className="font-medium text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white">By AI Priority</h3>
          <div className="flex flex-wrap gap-4">
            {(analytics?.byPriority || []).map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2"
              >
                <span className="text-zinc-300">{item._id}</span>
                <span className="font-bold text-indigo-400">{item.count}</span>
              </div>
            ))}
            {!analytics?.byPriority?.length && (
              <p className="text-sm text-zinc-500">No priority data yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/admin/users" className="card transition hover:border-indigo-500/40">
          <h3 className="font-semibold text-white">Manage Users</h3>
          <p className="mt-1 text-sm text-zinc-400">View and manage registered users</p>
        </Link>
        <Link to="/complaints" className="card transition hover:border-indigo-500/40">
          <h3 className="font-semibold text-white">All Complaints</h3>
          <p className="mt-1 text-sm text-zinc-400">Update status and delete complaints</p>
        </Link>
        <div className="card border-red-500/20">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-400" />
            <h3 className="font-semibold text-white">Rejected</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-red-400">{statusMap.Rejected || 0}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
