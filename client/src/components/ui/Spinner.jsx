const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-10 w-10 border-4',
  xl: 'h-12 w-12 border-4',
};

const Spinner = ({ size = 'md', className = '' }) => (
  <span
    className={`inline-block animate-spin rounded-full border-primary-500 border-t-transparent ${sizes[size]} ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16">
    <Spinner size="lg" />
    <p className="text-sm font-medium text-slate-500">{message}</p>
  </div>
);

export default Spinner;
