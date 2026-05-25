import StatusBadge from './StatusBadge';
import StatusSelect from './StatusSelect';

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const isOverdue = (task) => {
  if (!task.deadline || task.status === 'Completed') return false;
  return new Date(task.deadline) < new Date();
};

const TaskCards = ({ tasks, onStatusUpdate, canUpdateStatus, isAdmin, onDelete }) => (
  <div className="space-y-4 lg:hidden">
    {tasks.map((task) => (
      <div key={task._id} className="card-hover">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900">{task.title}</h3>
            {task.description && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{task.description}</p>
            )}
          </div>
          <StatusBadge status={task.status} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Project</p>
            <p className="mt-0.5 text-slate-700">{task.project?.title}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Assignee</p>
            <p className="mt-0.5 text-slate-700">{task.assignedTo?.name}</p>
          </div>
          {task.deadline && (
            <div className="col-span-2">
              <p className="text-xs font-medium uppercase text-slate-400">Deadline</p>
              <p className={`mt-0.5 ${isOverdue(task) ? 'font-medium text-red-600' : 'text-slate-700'}`}>
                {formatDate(task.deadline)}
                {isOverdue(task) && ' · Overdue'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          {canUpdateStatus(task) ? (
            <div className="flex-1">
              <p className="mb-1.5 text-xs font-medium text-slate-500">Update status</p>
              <StatusSelect
                taskId={task._id}
                currentStatus={task.status}
                onUpdate={onStatusUpdate}
              />
            </div>
          ) : null}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onDelete(task._id)}
              className="btn-danger shrink-0 py-2 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default TaskCards;
