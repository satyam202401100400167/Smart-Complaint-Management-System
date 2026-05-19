import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Download } from 'lucide-react';
import {
  getComplaints,
  searchByLocation,
  filterByCategory,
  exportCSV,
} from '../api/complaintApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { CATEGORIES } from '../utils/constants.js';
import { getErrorMessage, formatDate, truncate } from '../utils/helpers.js';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

const ComplaintList = () => {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let res;
      if (location.trim()) {
        res = await searchByLocation(location.trim(), { page, limit: 10 });
      } else if (category) {
        res = await filterByCategory(category, { page, limit: 10 });
      } else {
        res = await getComplaints({ page, limit: 10 });
      }
      setComplaints(res.data.data);
      setPages(res.data.pages || 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchComplaints();
  };

  const handleExport = async () => {
    try {
      const { data } = await exportCSV();
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'complaints-export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isAdmin ? 'All Complaints' : 'My Complaints'}
          </h1>
          <p className="text-zinc-400">Search, filter, and manage complaints</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <button type="button" onClick={handleExport} className="btn-secondary py-2 text-sm">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          )}
          <Link to="/complaints/new" className="btn-primary py-2 text-sm">
            <Plus className="h-4 w-4" /> New
          </Link>
        </div>
      </div>

      <div className="card flex flex-col gap-4 lg:flex-row">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              className="input-field pl-10"
              placeholder="Search by location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <select
            className="input-field w-full lg:w-48"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" className="min-h-[30vh]" />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description="Try different search filters or register a new complaint."
          action={
            <Link to="/complaints/new" className="btn-primary">
              Register Complaint
            </Link>
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-zinc-800/50 transition hover:bg-zinc-900/50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/complaints/${c._id}`}
                        className="font-medium text-white hover:text-indigo-400"
                      >
                        {truncate(c.title, 40)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{c.category}</td>
                    <td className="px-4 py-3 text-zinc-400">{c.location}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3">
                      {c.aiAnalysis?.priority ? (
                        <StatusBadge status={c.aiAnalysis.priority} type="priority" />
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-secondary py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-sm text-zinc-400">
                Page {page} of {pages}
              </span>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default ComplaintList;
