import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Chatbot from '../components/Chatbot.jsx';

const DashboardLayout = () => (
  <div className="flex min-h-screen flex-col bg-zinc-950">
    <Navbar />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
    <Chatbot />
  </div>
);

export default DashboardLayout;
