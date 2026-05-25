import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ allowedRoles = [] }) => {
  const { user, hasRole, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!allowedRoles.length) {
    return <Outlet />;
  }

  if (hasRole(...allowedRoles)) {
    return <Outlet />;
  }

  return (
    <Navigate
      to="/unauthorized"
      replace
      state={{
        requiredRoles: allowedRoles,
        userRole: user?.role,
      }}
    />
  );
};

export default RoleBasedRoute;
