import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

import { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div>Kraunama...</div>

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
