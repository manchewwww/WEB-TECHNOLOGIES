import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRoles?: string[];
};

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
