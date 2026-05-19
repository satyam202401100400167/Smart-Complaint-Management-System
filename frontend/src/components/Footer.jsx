import { Shield } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-zinc-800 bg-zinc-950 py-8">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-500" />
          <span className="font-semibold text-zinc-300">Smart Complaint Management</span>
        </div>
        <p className="text-sm text-zinc-500">
          AI-Powered Municipal Complaint System &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
