import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? 'text-indigo-400' : 'text-zinc-400 hover:text-white'}`;

  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-indigo-500" />
          <span className="text-lg font-bold text-white">SmartComplaint</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/complaints" className={navLinkClass}>
                Complaints
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
              <button type="button" onClick={handleLogout} className="btn-secondary py-2 text-sm">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <Link to="/signup" className="btn-primary py-2 text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden text-zinc-400"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zinc-800 md:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              <NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)} end>
                Home
              </NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard className="inline h-4 w-4 mr-1" /> Dashboard
                  </NavLink>
                  <NavLink to="/complaints" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                    Complaints
                  </NavLink>
                  {isAdmin && (
                    <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                      Admin
                    </NavLink>
                  )}
                  <button type="button" onClick={handleLogout} className="btn-secondary w-full">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                    Login
                  </NavLink>
                  <Link to="/signup" className="btn-primary text-center" onClick={() => setMobileOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
