import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center"
  >
    <div className="mb-6 rounded-full bg-zinc-800 p-6">
      <AlertTriangle className="h-16 w-16 text-indigo-400" />
    </div>
    <h1 className="text-6xl font-bold text-white">404</h1>
    <p className="mt-4 text-xl text-zinc-400">Page not found</p>
    <p className="mt-2 max-w-md text-zinc-500">
      The page you are looking for does not exist or has been moved.
    </p>
    <Link to="/" className="btn-primary mt-8">
      <Home className="h-4 w-4" />
      Back to Home
    </Link>
  </motion.div>
);

export default NotFound;
