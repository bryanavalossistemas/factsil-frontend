import { Navigate, Outlet } from 'react-router';
import useStore from '@/store';

export default function RedirectIfAuthenticated() {
  const { token } = useStore();

  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
