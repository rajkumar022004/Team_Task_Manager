import StatusBadge from './StatusBadge';
import StatusSelect from './StatusSelect';

const formatDate = (date) => {
  if (!date) return '—';
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

const TasksTable = ({ tasks, onStatusUpdate, canUpdateStatus, isAdmin, onDelete }) => (
  <div className="card hidden overflow-hidden p-0 lg:block">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th className="px-6 py-4 font-semibold text-slate-700">Task</th>
            <th className="px-6 py-4 font-semibold text-slate-700">Project</th>
            <th className="px-6 py-4 font-semibold text-slate-700">Assignee</th>
            <th className="px-6 py-4 font-semibold text-slate-700">Deadline</th>
            <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
            {isAdmin && <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <tr key={task._id} className="transition-colors hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <p className="font-semibold text-slate-900">{task.title}</p>
                {task.description && (
                  <p className="mt-1 max-w-xs truncate text-slate-500">{task.description}</p>
                )}
              </td>
              <td className="px-6 py-4 text-slate-700">{task.project?.title}</td>
              <td className="px-6 py-4">
                <p className="font-medium text-slate-700">{task.assignedTo?.name}</p>
                <p className="text-xs text-slate-500">{task.assignedTo?.email}</p>
              </td>
              <td className="px-6 py-4">
                <span className={isOverdue(task) ? 'font-medium text-red-600' : 'text-slate-600'}>
                  {formatDate(task.deadline)}
                  {isOverdue(task) && ' (Overdue)'}
                </span>
              </td>
              <td className="px-6 py-4">
                {canUpdateStatus(task) ? (
                  <StatusSelect
                    taskId={task._id}
                    currentStatus={task.status}
                    onUpdate={onStatusUpdate}
                  />
                ) : (
                  <StatusBadge status={task.status} />
                )}
              </td>
              {isAdmin && (
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onDelete(task._id)}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TasksTable;
