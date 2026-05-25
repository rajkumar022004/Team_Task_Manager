const TasksSkeleton = () => (
  <>
    <div className="hidden lg:block">
      <div className="card animate-pulse p-0">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 border-b border-slate-50 px-6 py-4 last:border-0">
            <div className="h-10 flex-1 rounded bg-slate-200" />
            <div className="h-10 w-24 rounded bg-slate-200" />
            <div className="h-10 w-32 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
    <div className="space-y-4 lg:hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-5 w-2/3 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-full rounded bg-slate-200" />
          <div className="mt-4 h-10 w-full rounded bg-slate-200" />
        </div>
      ))}
    </div>
  </>
);

export default TasksSkeleton;
