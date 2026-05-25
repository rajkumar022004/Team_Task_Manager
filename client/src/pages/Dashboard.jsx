import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/dashboardService';
import StatCard from '../components/dashboard/StatCard';
import StatCardSkeleton from '../components/dashboard/StatCardSkeleton';
import PageHeader from '../components/ui/PageHeader';
import ErrorBanner from '../components/ui/ErrorBanner';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';

const TotalIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const CompletedIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PendingIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const OverdueIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setStats(null);
      setError(err.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const completionRate = useMemo(() => {
    if (!stats?.totalTasks) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  }, [stats]);

  const statConfig = useMemo(
    () => [
      { key: 'totalTasks', label: 'Total Tasks', accent: 'primary', icon: <TotalIcon />, trend: stats?.totalTasks ? 'All' : null },
      { key: 'completedTasks', label: 'Completed', accent: 'green', icon: <CompletedIcon />, trend: stats?.totalTasks ? `${completionRate}%` : null },
      { key: 'pendingTasks', label: 'Pending', accent: 'amber', icon: <PendingIcon />, trend: 'Active' },
      { key: 'overdueTasks', label: 'Overdue', accent: 'red', icon: <OverdueIcon />, trend: stats?.overdueTasks > 0 ? 'Alert' : 'Clear' },
    ],
    [stats, completionRate]
  );

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page-container">
      <div className="dashboard-hero">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary-100">
              {greeting()}, {user?.name?.split(' ')[0]}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
            <p className="mt-2 max-w-lg text-sm text-primary-100/90">
              {isAdmin
                ? 'Overview of all team tasks and progress at a glance.'
                : 'Track your assigned tasks and stay on top of deadlines.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/tasks" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 shadow-sm transition hover:bg-primary-50">
              View Tasks
            </Link>
            <Link to="/projects" className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/30 transition hover:bg-white/20">
              Projects
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/5" />
      </div>

      {error && (
        <ErrorBanner title="Unable to load dashboard" message={error} onRetry={fetchStats} />
      )}

      {loading ? (
        <div className="relative">
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
            <Spinner size="lg" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {statConfig.map(({ key, label, accent, icon, trend }) => (
            <StatCard
              key={key}
              label={label}
              value={stats?.[key] ?? 0}
              icon={icon}
              accent={accent}
              trend={trend}
            />
          ))}
        </div>
      )}

      {!loading && !error && stats?.totalTasks === 0 && (
        <EmptyState
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title="No tasks yet"
          description={isAdmin ? 'Create projects and tasks to see your dashboard come to life.' : 'Tasks assigned to you will appear here.'}
          action={
            <Link to={isAdmin ? '/tasks' : '/projects'} className="btn-primary">
              {isAdmin ? 'Create a task' : 'View projects'}
            </Link>
          }
        />
      )}

      {!loading && !error && stats && stats.totalTasks > 0 && (
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="card lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">Task completion</h2>
            <p className="mt-1 text-sm text-slate-500">
              Progress across your {isAdmin ? 'team' : 'assigned'} tasks
            </p>

            <div className="mt-6 sm:mt-8">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">Completion rate</span>
                <span className="text-lg font-bold text-primary-600">{completionRate}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-700 ease-out"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: 'Done', value: stats.completedTasks, color: 'text-slate-900' },
                  { label: 'Pending', value: stats.pendingTasks, color: 'text-slate-900' },
                  { label: 'Overdue', value: stats.overdueTasks, color: 'text-red-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl bg-slate-50 px-3 py-4 text-center sm:px-4">
                    <p className={`text-xl font-bold sm:text-2xl ${color}`}>{value}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900">Quick summary</h2>
            <p className="mt-1 text-sm text-slate-500">Current task breakdown</p>

            <ul className="mt-6 space-y-4">
              {[
                { label: 'Total workload', value: stats.totalTasks, className: 'text-slate-900' },
                { label: 'In progress / pending', value: stats.pendingTasks, className: 'text-amber-600' },
                { label: 'Completed', value: stats.completedTasks, className: 'text-green-600' },
                { label: 'Needs attention', value: stats.overdueTasks > 0 ? stats.overdueTasks : 'None', className: stats.overdueTasks > 0 ? 'text-red-600' : 'text-green-600' },
              ].map(({ label, value, className }, i, arr) => (
                <li
                  key={label}
                  className={`flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-slate-100 pb-4' : ''}`}
                >
                  <span className="text-sm text-slate-600">{label}</span>
                  <span className={`font-semibold ${className}`}>{value}</span>
                </li>
              ))}
            </ul>

            {stats.overdueTasks > 0 && (
              <Link to="/tasks" className="btn-primary mt-6 w-full text-center">
                Review overdue tasks
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
