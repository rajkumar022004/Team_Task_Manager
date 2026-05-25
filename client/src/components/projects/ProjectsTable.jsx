import MemberAvatars from './MemberAvatars';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const ProjectsTable = ({ projects }) => (
  <div className="card hidden overflow-hidden p-0 lg:block">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th className="px-6 py-4 font-semibold text-slate-700">Project</th>
            <th className="px-6 py-4 font-semibold text-slate-700">Members</th>
            <th className="px-6 py-4 font-semibold text-slate-700">Created by</th>
            <th className="px-6 py-4 font-semibold text-slate-700">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {projects.map((project) => (
            <tr key={project._id} className="transition-colors hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <p className="font-semibold text-slate-900">{project.title}</p>
                <p className="mt-1 max-w-xs truncate text-slate-500">
                  {project.description || 'No description'}
                </p>
              </td>
              <td className="px-6 py-4">
                <MemberAvatars members={project.members} />
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.members?.map((member) => (
                    <span
                      key={member._id}
                      className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                    >
                      {member.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="font-medium text-slate-700">{project.createdBy?.name}</span>
                <p className="text-xs text-slate-500">{project.createdBy?.email}</p>
              </td>
              <td className="px-6 py-4 text-slate-500">{formatDate(project.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ProjectsTable;
