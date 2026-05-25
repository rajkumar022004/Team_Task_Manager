import MemberAvatars from './MemberAvatars';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const ProjectCards = ({ projects }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
    {projects.map((project) => (
      <div key={project._id} className="card-hover">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-slate-900">{project.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
              {project.description || 'No description'}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
            {project.members?.length ?? 0} members
          </span>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Team members
          </p>
          <MemberAvatars members={project.members} max={5} />
          {project.members?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.members.map((member) => (
                <span
                  key={member._id}
                  className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                >
                  {member.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>By {project.createdBy?.name}</span>
          <span>{formatDate(project.createdAt)}</span>
        </div>
      </div>
    ))}
  </div>
);

export default ProjectCards;
