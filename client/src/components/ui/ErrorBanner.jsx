const ErrorBanner = ({ title, message, onRetry }) => (
  <div className="flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50/80 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        <p className="font-medium text-red-900">{title || 'Something went wrong'}</p>
        {message && <p className="mt-1 text-sm text-red-700">{message}</p>}
      </div>
    </div>
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn-secondary shrink-0">
        Try again
      </button>
    )}
  </div>
);

export default ErrorBanner;
