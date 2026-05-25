import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const requiredRoles = location.state?.requiredRoles ?? [];
  const userRole = location.state?.userRole ?? user?.role;

  if (!isAuthenticated) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
      <div className="card max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-900">Access denied</h1>
        <p className="mt-3 text-slate-600">
          You don&apos;t have permission to view this page.
        </p>

        {requiredRoles.length > 0 && (
          <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p>
              Required role: <span className="font-medium capitalize">{requiredRoles.join(' or ')}</span>
            </p>
            <p className="mt-1">
              Your role: <span className="font-medium capitalize">{userRole}</span>
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/dashboard" className="btn-primary">
            Go to dashboard
          </Link>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
