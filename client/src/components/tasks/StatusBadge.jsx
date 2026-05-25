import { STATUS_STYLES } from './constants';

const StatusBadge = ({ status, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset ${
        STATUS_STYLES[status] || STATUS_STYLES.Todo
      } ${sizeClass}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === 'Completed'
            ? 'bg-green-500'
            : status === 'In Progress'
              ? 'bg-blue-500'
              : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
