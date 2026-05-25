const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => (
  <div className={`card flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}>
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600">
      {icon}
    </div>
    <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
    {description && (
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
