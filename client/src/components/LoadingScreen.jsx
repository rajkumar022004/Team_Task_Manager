import Spinner from './ui/Spinner';

const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
    <Spinner size="xl" />
    <p className="text-sm font-medium text-slate-500">{message}</p>
  </div>
);

export default LoadingScreen;
