import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getTasks, updateTask, deleteTask } from '../services/taskService';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import StatusFilter from '../components/tasks/StatusFilter';
import TasksTable from '../components/tasks/TasksTable';
import TaskCards from '../components/tasks/TaskCards';
import TasksSkeleton from '../components/tasks/TasksSkeleton';
import { STATUS_FILTERS } from '../components/tasks/constants';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import ErrorBanner from '../components/ui/ErrorBanner';

const taskIcon = (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const Tasks = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (err) {
      setTasks([]);
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const statusCounts = useMemo(() => {
    const counts = { All: tasks.length };
    STATUS_FILTERS.slice(1).forEach((status) => {
      counts[status] = tasks.filter((t) => t.status === status).length;
    });
    return counts;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.project?.title?.toLowerCase().includes(query) ||
        task.assignedTo?.name?.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [tasks, statusFilter, search]);

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await updateTask(taskId, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? response.data : t)));
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
      throw err;
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
    }
  };

  const canUpdateStatus = (task) => {
    if (isAdmin) return true;
    const assigneeId = task.assignedTo?._id?.toString?.() ?? task.assignedTo?._id;
    const userId = user?.id?.toString?.() ?? user?.id;
    return assigneeId === userId;
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    toast.success('Task created successfully');
  };

  const isEmpty = !loading && !error && tasks.length === 0;
  const noResults = !loading && !error && tasks.length > 0 && filteredTasks.length === 0;

  return (
    <div className="page-container">
      <PageHeader
        title="Tasks"
        description={
          isAdmin ? 'Manage and track all team tasks' : 'Update status on your assigned tasks'
        }
        actions={
          isAdmin && (
            <button type="button" onClick={() => setModalOpen(true)} className="btn-primary w-full sm:w-auto">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New task
            </button>
          )
        }
      />

      {!loading && tasks.length > 0 && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <StatusFilter active={statusFilter} onChange={setStatusFilter} counts={statusCounts} />
          <div className="relative w-full lg:max-w-xs">
            <svg className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="search"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
      )}

      {error && <ErrorBanner message={error} onRetry={fetchTasks} />}

      {loading && <TasksSkeleton />}

      {isEmpty && (
        <EmptyState
          icon={taskIcon}
          title="No tasks yet"
          description={
            isAdmin
              ? 'Create a task and assign it to a team member.'
              : 'You have no tasks assigned to you yet.'
          }
          action={
            isAdmin && (
              <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
                Create task
              </button>
            )
          }
        />
      )}

      {noResults && (
        <EmptyState
          icon={taskIcon}
          title={statusFilter !== 'All' ? `No ${statusFilter.toLowerCase()} tasks` : 'No matching tasks'}
          description="Try a different filter or search term."
        />
      )}

      {!loading && !error && filteredTasks.length > 0 && (
        <>
          <p className="text-sm text-slate-500">
            Showing {filteredTasks.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
          <TasksTable
            tasks={filteredTasks}
            onStatusUpdate={handleStatusUpdate}
            canUpdateStatus={canUpdateStatus}
            isAdmin={isAdmin}
            onDelete={handleDelete}
          />
          <TaskCards
            tasks={filteredTasks}
            onStatusUpdate={handleStatusUpdate}
            canUpdateStatus={canUpdateStatus}
            isAdmin={isAdmin}
            onDelete={handleDelete}
          />
        </>
      )}

      <CreateTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleTaskCreated}
      />
    </div>
  );
};

export default Tasks;
