import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, MapPin, Mail, Tag, Calendar } from 'lucide-react';
import { getComplaintById, updateComplaint, deleteComplaint } from '../api/complaintApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { STATUSES } from '../utils/constants.js';
import { getErrorMessage, formatDate } from '../utils/helpers.js';
import AIAnalysisCard from '../components/AIAnalysisCard.jsx';
import Timeline from '../components/Timeline.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchComplaint = async () => {
    try {
      const { data } = await getComplaintById(id);
      setComplaint(data.data);
      setStatus(data.data.status);
    } catch (err) {
      toast.error(getErrorMessage(err));
      navigate('/complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data } = await updateComplaint(id, { status, note });
      setComplaint(data.data);
      toast.success('Status updated successfully');
      setNote('');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await deleteComplaint(id);
      toast.success('Complaint deleted');
      navigate('/complaints');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[40vh]" />;
  if (!complaint) return null;

  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl space-y-6">
      <Link to="/complaints" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to complaints
      </Link>

      <div className="card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{complaint.title}</h1>
              <StatusBadge status={complaint.status} />
            </div>
            <p className="mt-3 text-zinc-300">{complaint.description}</p>
          </div>
          {isAdmin && (
            <button type="button" onClick={handleDelete} className="btn-secondary border-red-500/50 text-red-400 hover:bg-red-500/10">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Tag className="h-4 w-4 text-indigo-400" />
            {complaint.category}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <MapPin className="h-4 w-4 text-indigo-400" />
            {complaint.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Mail className="h-4 w-4 text-indigo-400" />
            {complaint.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Calendar className="h-4 w-4 text-indigo-400" />
            {formatDate(complaint.createdAt)}
          </div>
        </div>

        {complaint.attachment?.path && (
          <div className="mt-4">
            <a
              href={`${apiBase}${complaint.attachment.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:underline"
            >
              View attachment: {complaint.attachment.filename}
            </a>
          </div>
        )}
      </div>

      <AIAnalysisCard analysis={complaint.aiAnalysis} />

      <Timeline entries={complaint.timeline} />

      {isAdmin && (
        <form onSubmit={handleStatusUpdate} className="card space-y-4">
          <h3 className="text-lg font-semibold text-white">Update Status</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Status</label>
              <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Note (optional)</label>
              <input
                className="input-field"
                placeholder="Add update note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" disabled={updating} className="btn-primary">
            {updating ? <LoadingSpinner size="sm" /> : 'Update Status'}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default ComplaintDetails;
