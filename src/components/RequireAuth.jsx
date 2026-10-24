import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const homeFor = (user) => (user.role === 'admin' ? '/admin' : user.store ? '/seller' : '/setup')

export default function RequireAuth({ role, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="empty">Loading...</div>
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (role && user.role !== role) return <Navigate to={homeFor(user)} replace />
  return children
}
