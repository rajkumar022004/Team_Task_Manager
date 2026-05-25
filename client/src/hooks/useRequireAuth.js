import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useRequireAuth = (allowedRoles = []) => {
  const { isAuthenticated, loading, hasRole, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (allowedRoles.length && !hasRole(...allowedRoles)) {
      navigate('/unauthorized', {
        replace: true,
        state: { requiredRoles: allowedRoles, userRole: user?.role },
      });
    }
  }, [loading, isAuthenticated, hasRole, allowedRoles, navigate, user]);

  return { isAuthenticated, loading, user, hasRole };
};

export default useRequireAuth;
