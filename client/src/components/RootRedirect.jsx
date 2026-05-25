import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

export default RootRedirect;
