import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trash2, Shield } from 'lucide-react';
import { getUsers, updateUserRole, deleteUser } from '../api/adminApi.js';
import { useToast } from '../context/ToastContext.jsx';
import { getErrorMessage, formatDate } from '../utils/helpers.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

const AdminUsers = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers({ search: search || undefined, limit: 50 });
      setUsers(data.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
          <Users className="h-7 w-7 text-indigo-400" />
          Manage Users
        </h1>
        <p className="text-zinc-400">View and manage platform users</p>
      </div>

      <div className="card flex gap-3">
        <input
          className="input-field flex-1"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="button" onClick={fetchUsers} className="btn-primary">
          Search
        </button>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" className="min-h-[30vh]" />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                  <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      className="input-field py-1.5 text-sm"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(u._id)}
                      className="rounded p-1.5 text-red-400 transition hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default AdminUsers;
