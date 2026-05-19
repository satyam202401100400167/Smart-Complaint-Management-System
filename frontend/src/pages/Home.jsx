import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Brain,
  MapPin,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    desc: 'Automatic priority detection, department routing, and smart responses.',
  },
  {
    icon: MapPin,
    title: 'Location Search',
    desc: 'Find and track complaints by geographic location instantly.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Tracking',
    desc: 'Monitor complaint status with timeline updates and notifications.',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    desc: 'JWT authentication with role-based admin and user access.',
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-zinc-950 to-zinc-950" />
        <motion.div
          className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300"
          >
            <Brain className="h-4 w-4" />
            AI-Based Smart Complaint Management
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          >
            Report. Track. Resolve.
            <span className="block text-indigo-400">Smarter Civic Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400"
          >
            A production-ready platform for citizens to register municipal complaints with
            AI-driven urgency analysis, department recommendations, and real-time status tracking.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              to={isAuthenticated ? '/complaints/new' : '/signup'}
              className="btn-primary px-6 py-3 text-base"
            >
              File a Complaint
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn-secondary px-6 py-3 text-base">
              {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-white">Platform Features</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card hover:border-indigo-500/40 transition"
            >
              <f.icon className="mb-4 h-10 w-10 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-900/30 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white">How It Works</h2>
          <div className="mt-10 space-y-6 text-left">
            {[
              'Register and log in to your citizen account',
              'Submit a complaint with category and location details',
              'AI analyzes urgency and routes to the right department',
              'Track status updates via your personal dashboard',
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
                <p className="text-zinc-300">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
