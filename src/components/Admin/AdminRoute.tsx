import { Navigate, Outlet } from "react-router-dom"
import { useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"

const AdminRoute: React.FC = () => {
    const { user, isAuthenticated } = useAuth()

    useEffect(() => {
        console.log("AdminRoute - User:", user)
        console.log("AdminRoute - IsAuthenticated:", isAuthenticated)
        
        if (isAuthenticated && user && user.role !== "admin") {
            console.log("AdminRoute - User role:", user.role)
            alert("Neturite teisių peržiūrėti šį puslapį")
        }
    }, [isAuthenticated, user])

    if (!isAuthenticated) {
        return <div>Kraunama...</div> 
    }

    if (!user) {
        console.log("AdminRoute - No user found")
        return <Navigate to="/login" replace />
    }

    if (user.role !== "admin") {
        console.log("AdminRoute - User is not admin, role:", user.role)
        return <Navigate to="/" replace />
    }

    console.log("AdminRoute - Access granted")
    return <Outlet />
}

export default AdminRoute
