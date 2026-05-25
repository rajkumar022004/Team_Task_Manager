import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getProjects } from '../services/projectService';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import ProjectCards from '../components/projects/ProjectCards';
import ProjectsTable from '../components/projects/ProjectsTable';
import ProjectsSkeleton from '../components/projects/ProjectsSkeleton';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import ErrorBanner from '../components/ui/ErrorBanner';

const projectIcon = (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
);

const Projects = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getProjects();
      setProjects(response.data);
    } catch (err) {
      setProjects([]);
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    toast.success('Project created successfully');
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description?.toLowerCase().includes(search.toLowerCase()) ||
      project.members?.some((m) => m.name.toLowerCase().includes(search.toLowerCase()))
  );

  const isEmpty = !loading && !error && projects.length === 0;
  const noResults = !loading && !error && projects.length > 0 && filteredProjects.length === 0;

  return (
    <div className="page-container">
      <PageHeader
        title="Projects"
        description={
          isAdmin
            ? 'Manage team projects and member assignments'
            : 'Projects you are assigned to'
        }
        actions={
          isAdmin && (
            <button type="button" onClick={() => setModalOpen(true)} className="btn-primary w-full sm:w-auto">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New project
            </button>
          )
        }
      />

      {!loading && projects.length > 0 && (
        <div className="relative w-full max-w-md">
          <svg className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="search"
            placeholder="Search projects or members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      )}

      {error && <ErrorBanner message={error} onRetry={fetchProjects} />}

      {loading && <ProjectsSkeleton />}

      {isEmpty && (
        <EmptyState
          icon={projectIcon}
          title="No projects yet"
          description={
            isAdmin
              ? 'Create your first project and assign team members to get started.'
              : 'You have not been assigned to any projects yet.'
          }
          action={
            isAdmin && (
              <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
                Create project
              </button>
            )
          }
        />
      )}

      {noResults && (
        <EmptyState
          icon={projectIcon}
          title="No matching projects"
          description={`No projects match "${search}". Try a different search term.`}
        />
      )}

      {!loading && !error && filteredProjects.length > 0 && (
        <>
          <p className="text-sm text-slate-500">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            {search && ` matching "${search}"`}
          </p>
          <ProjectsTable projects={filteredProjects} />
          <ProjectCards projects={filteredProjects} />
        </>
      )}

      <CreateProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  );
};

export default Projects;
