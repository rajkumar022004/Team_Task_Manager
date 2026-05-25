import { useCallback, useEffect, useState } from 'react';
import { createProject } from '../../services/projectService';
import { getMembers } from '../../services/userService';

const CreateProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({ title: '', description: '', members: [] });
  const [availableMembers, setAvailableMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const resetForm = useCallback(() => {
    setForm({ title: '', description: '', members: [] });
    setErrors({});
    setApiError('');
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        const response = await getMembers();
        setAvailableMembers(response.data);
      } catch {
        setAvailableMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (form.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleMember = (memberId) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await createProject({
        title: form.title.trim(),
        description: form.description.trim(),
        members: form.members,
      });
      resetForm();
      onSuccess(response.data);
      onClose();
    } catch (err) {
      setApiError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <h2 id="create-project-title" className="text-lg font-semibold text-slate-900">
            Create new project
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {apiError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}

          <div>
            <label htmlFor="title" className="input-label">
              Project title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className={`input ${errors.title ? 'border-red-400' : ''}`}
              placeholder="Website redesign"
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="input-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="input resize-none"
              placeholder="Brief project description..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="input-label">Assign members</label>
            {loadingMembers ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />
                ))}
              </div>
            ) : availableMembers.length === 0 ? (
              <p className="text-sm text-slate-500">No members available to assign.</p>
            ) : (
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-2">
                {availableMembers.map((member) => (
                  <label
                    key={member._id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={form.members.includes(member._id)}
                      onChange={() => toggleMember(member._id)}
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{member.name}</p>
                      <p className="truncate text-xs text-slate-500">{member.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-slate-500">
              {form.members.length} member{form.members.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary min-w-[140px]">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </span>
              ) : (
                'Create project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
