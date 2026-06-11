import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { PageLoader } from '../ui/LoadingSpinner'

export default function ProtectedRoute() {
  const { user, loading } = useAuthStore()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}
