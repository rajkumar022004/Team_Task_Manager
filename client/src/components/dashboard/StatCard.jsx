const StatCard = ({ label, value, icon, accent, trend }) => {
  const styles = {
    primary: {
      card: 'border-primary-100/80 bg-white',
      icon: 'bg-primary-100 text-primary-600',
      value: 'text-primary-700',
      badge: 'bg-primary-50 text-primary-700',
    },
    green: {
      card: 'border-green-100/80 bg-white',
      icon: 'bg-green-100 text-green-600',
      value: 'text-green-700',
      badge: 'bg-green-50 text-green-700',
    },
    amber: {
      card: 'border-amber-100/80 bg-white',
      icon: 'bg-amber-100 text-amber-600',
      value: 'text-amber-700',
      badge: 'bg-amber-50 text-amber-700',
    },
    red: {
      card: 'border-red-100/80 bg-white',
      icon: 'bg-red-100 text-red-600',
      value: 'text-red-700',
      badge: 'bg-red-50 text-red-700',
    },
  };

  const theme = styles[accent] || styles.primary;

  return (
    <div
      className={`card-hover border ${theme.card} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${theme.icon}`}>
          {icon}
        </div>
        {trend !== undefined && trend !== null && (
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${theme.badge}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold tracking-tight ${theme.value}`}>{value}</p>
    </div>
  );
};

export default StatCard;
