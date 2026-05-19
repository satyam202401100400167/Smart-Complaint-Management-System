import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilePlus, Brain, Upload } from 'lucide-react';
import { createComplaint } from '../api/complaintApi.js';
import { analyzeComplaint } from '../api/aiApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { CATEGORIES } from '../utils/constants.js';
import { getErrorMessage } from '../utils/helpers.js';
import AIAnalysisCard from '../components/AIAnalysisCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const RegisterComplaint = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: '',
    description: '',
    category: '',
    location: '',
  });

  const handleAnalyze = async () => {
    if (!form.title || !form.description || !form.category || !form.location) {
      toast.error('Fill title, description, category, and location before AI analysis');
      return;
    }
    setAnalyzing(true);
    try {
      const { data } = await analyzeComplaint({
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
      });
      setAnalysis(data.data);
      toast.success('AI analysis complete');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.title || !form.description || !form.category || !form.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([k, v]) => payload.append(k, v));
      if (file) payload.append('attachment', file);

      const { data } = await createComplaint(payload);
      toast.success('Complaint registered successfully!');
      navigate(`/complaints/${data.data._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Register Complaint</h1>
        <p className="mt-1 text-zinc-400">Submit a new complaint with AI-powered analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full Name *</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Title *</label>
            <input
              className="input-field"
              placeholder="Brief summary of the issue"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Category *</label>
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Location *</label>
            <input
              className="input-field"
              placeholder="Area, street, landmark"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description *</label>
            <textarea
              rows={5}
              className="input-field resize-none"
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Attachment (optional)</label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 px-4 py-6 transition hover:border-indigo-500/50">
              <Upload className="h-5 w-5 text-zinc-500" />
              <span className="text-sm text-zinc-400">
                {file ? file.name : 'Upload image or PDF (max 5MB)'}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleAnalyze} disabled={analyzing} className="btn-secondary">
            {analyzing ? <LoadingSpinner size="sm" /> : <Brain className="h-4 w-4" />}
            Preview AI Analysis
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <LoadingSpinner size="sm" /> : <FilePlus className="h-4 w-4" />}
            Submit Complaint
          </button>
        </div>
      </form>

      {analysis && <AIAnalysisCard analysis={analysis} />}
    </motion.div>
  );
};

export default RegisterComplaint;
