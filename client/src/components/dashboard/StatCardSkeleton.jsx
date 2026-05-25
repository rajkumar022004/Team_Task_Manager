const StatCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="flex items-start justify-between">
      <div className="h-12 w-12 rounded-xl bg-slate-200" />
      <div className="h-4 w-16 rounded bg-slate-200" />
    </div>
    <div className="mt-4 h-4 w-24 rounded bg-slate-200" />
    <div className="mt-3 h-9 w-16 rounded bg-slate-200" />
  </div>
);

export default StatCardSkeleton;
