import { useApp } from '../context/AppContext';
import { PageSkeleton, ErrorState } from './ui';
export default function Gate({ children }) {
  const { loading, error, data, reload } = useApp();
  if (error && !data) return <ErrorState message={error} onRetry={() => reload()} />;
  if (loading || !data) return <PageSkeleton />;
  return children;
}
