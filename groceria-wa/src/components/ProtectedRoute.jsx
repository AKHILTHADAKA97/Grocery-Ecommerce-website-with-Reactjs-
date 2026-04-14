import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { admin } = useAuth()
  const loc = useLocation()
  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />
  }
  return children
}
