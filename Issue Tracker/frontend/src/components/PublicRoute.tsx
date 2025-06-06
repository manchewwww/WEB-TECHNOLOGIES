import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type PublicRouteProps = {
  children: JSX.Element;
};

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
