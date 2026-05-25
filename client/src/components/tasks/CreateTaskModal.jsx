import { useCallback, useEffect, useMemo, useState } from 'react';
import { createTask } from '../../services/taskService';
import { getProjects } from '../../services/projectService';
import { TASK_STATUSES } from './constants';

const CreateTaskModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    status: 'Todo',
    deadline: '',
  });
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const resetForm = useCallback(() => {
    setForm({
      title: '',
      description: '',
      project: '',
      assignedTo: '',
      status: 'Todo',
      deadline: '',
    });
    setErrors({});
    setApiError('');
  }, []);

  const projectMembers = useMemo(() => {
    const selected = projects.find((p) => p._id === form.project);
    return selected?.members ?? [];
  }, [projects, form.project]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const response = await getProjects();
        setProjects(response.data);
      } catch {
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
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

    if (!form.title.trim()) newErrors.title = 'Task title is required';
    if (!form.project) newErrors.project = 'Project is required';
    if (!form.assignedTo) newErrors.assignedTo = 'Assignee is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'project') updated.assignedTo = '';
      return updated;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        project: form.project,
        assignedTo: form.assignedTo,
        status: form.status,
        deadline: form.deadline || null,
      });
      resetForm();
      onSuccess(response.data);
      onClose();
    } catch (err) {
      setApiError(err.message || 'Failed to create task');
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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Create new task</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Close"
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
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              className={`input ${errors.title ? 'border-red-400' : ''}`}
              value={form.title}
              onChange={handleChange}
              placeholder="Design homepage mockup"
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
              value={form.description}
              onChange={handleChange}
              placeholder="Task details..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="project" className="input-label">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                id="project"
                name="project"
                value={form.project}
                onChange={handleChange}
                disabled={loadingProjects}
                className={`input ${errors.project ? 'border-red-400' : ''}`}
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
              {errors.project && <p className="mt-1 text-sm text-red-600">{errors.project}</p>}
            </div>

            <div>
              <label htmlFor="assignedTo" className="input-label">
                Assign to <span className="text-red-500">*</span>
              </label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                disabled={!form.project}
                className={`input ${errors.assignedTo ? 'border-red-400' : ''}`}
              >
                <option value="">
                  {form.project ? 'Select member' : 'Select project first'}
                </option>
                {projectMembers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {errors.assignedTo && (
                <p className="mt-1 text-sm text-red-600">{errors.assignedTo}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="status" className="input-label">
                Status
              </label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className="input">
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="deadline" className="input-label">
                Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </span>
              ) : (
                'Create task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
