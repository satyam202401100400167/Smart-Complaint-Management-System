import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  List,
  Shield,
  Users,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'bg-indigo-600/20 text-indigo-400'
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
    }`;

  const userLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/complaints/new', icon: FilePlus, label: 'New Complaint' },
    { to: '/complaints', icon: List, label: 'My Complaints' },
  ];

  const adminLinks = [
    { to: '/admin', icon: BarChart3, label: 'Admin Dashboard' },
    { to: '/complaints', icon: List, label: 'All Complaints' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-800 bg-zinc-950 lg:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col p-4">
        <div className="mb-6 flex items-center gap-2 px-2">
          <Shield className="h-5 w-5 text-indigo-500" />
          <span className="text-sm font-semibold text-zinc-300">
            {isAdmin ? 'Admin Panel' : 'User Panel'}
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/dashboard' || link.to === '/admin'}>
              <link.icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
