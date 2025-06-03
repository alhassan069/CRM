import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Check if user is admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // Render either the children or the Outlet
  return children || <Outlet />;
};

export default AdminRoute; 