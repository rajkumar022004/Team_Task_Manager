export const TASK_STATUSES = ['Todo', 'In Progress', 'Completed'];

export const STATUS_FILTERS = ['All', ...TASK_STATUSES];

export const STATUS_STYLES = {
  Todo: 'bg-slate-100 text-slate-700 ring-slate-200',
  'In Progress': 'bg-blue-100 text-blue-700 ring-blue-200',
  Completed: 'bg-green-100 text-green-700 ring-green-200',
};
