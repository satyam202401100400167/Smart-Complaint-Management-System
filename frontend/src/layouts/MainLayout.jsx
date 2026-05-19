import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Chatbot from '../components/Chatbot.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {isAuthenticated && <Chatbot />}
    </div>
  );
};

export default MainLayout;
