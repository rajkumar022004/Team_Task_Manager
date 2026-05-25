import { STATUS_FILTERS } from './constants';

const StatusFilter = ({ active, onChange, counts = {} }) => (
  <div className="flex flex-wrap gap-2">
    {STATUS_FILTERS.map((status) => (
      <button
        key={status}
        type="button"
        onClick={() => onChange(status)}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          active === status
            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
            : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
        }`}
      >
        {status}
        {counts[status] !== undefined && (
          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              active === status ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {counts[status]}
          </span>
        )}
      </button>
    ))}
  </div>
);

export default StatusFilter;
