const ProjectsSkeleton = () => (
  <>
    <div className="hidden gap-4 lg:grid">
      <div className="card animate-pulse p-0">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="h-4 w-full max-w-md rounded bg-slate-200" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-6 border-b border-slate-50 px-6 py-4 last:border-0">
            <div className="h-10 flex-1 rounded bg-slate-200" />
            <div className="h-10 w-32 rounded bg-slate-200" />
            <div className="h-10 w-24 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-5 w-3/4 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-full rounded bg-slate-200" />
          <div className="mt-6 h-8 w-24 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  </>
);

export default ProjectsSkeleton;
