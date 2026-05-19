import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import RegisterComplaint from '../pages/RegisterComplaint.jsx';
import ComplaintList from '../pages/ComplaintList.jsx';
import ComplaintDetails from '../pages/ComplaintDetails.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import AdminUsers from '../pages/AdminUsers.jsx';
import NotFound from '../pages/NotFound.jsx';

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
    </Route>

    <Route
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="complaints" element={<ComplaintList />} />
      <Route path="complaints/new" element={<RegisterComplaint />} />
      <Route path="complaints/:id" element={<ComplaintDetails />} />
    </Route>

    <Route
      element={
        <ProtectedRoute adminOnly>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="admin/users" element={<AdminUsers />} />
    </Route>

    <Route element={<MainLayout />}>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
