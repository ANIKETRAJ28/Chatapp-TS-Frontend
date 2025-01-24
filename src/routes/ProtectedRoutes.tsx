import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export function ProtectedRoute({ component: Component }: { component: React.ComponentType }): React.ReactElement {
  const id = useAuthStore((state) => state).id;

  if (!id) {
    return <Navigate to="/" />;
  }

  return <Component />;
}

export default ProtectedRoute;
