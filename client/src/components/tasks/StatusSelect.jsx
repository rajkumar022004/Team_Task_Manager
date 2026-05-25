import { useState } from 'react';
import { TASK_STATUSES } from './constants';

const StatusSelect = ({ taskId, currentStatus, onUpdate, disabled = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    setLoading(true);
    setError('');

    try {
      await onUpdate(taskId, newStatus);
    } catch (err) {
      setError(err.message || 'Update failed');
      e.target.value = currentStatus;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={disabled || loading}
        className="input cursor-pointer py-2 pr-8 text-sm disabled:cursor-not-allowed"
        aria-label="Update task status"
      >
        {TASK_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      {loading && (
        <span className="absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default StatusSelect;
