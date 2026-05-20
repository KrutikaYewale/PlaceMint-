import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — Guards routes based on authentication and role
 */
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    // Redirect to appropriate dashboard
    const paths = { student: '/student/dashboard', company: '/company/dashboard', admin: '/admin/dashboard' };
    return <Navigate to={paths[user?.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
