import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import api from "../../utils/axios"
import Breadcrumb from "../Breadcrumb/Breadcrumb"

const AdminMetrics: React.FC = () => {
    const { user } = useAuth()

    const [totalOrders, setTotalOrders] = useState(0)
    const [revenue, setRevenue] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true) 
                const res = await api.get('/admin/metrics')
                console.log("Received data: ", res.data)

                setTotalOrders(res.data.totalOrders || 0)
                setRevenue(res.data.totalRevenue  || 0)

            } catch {
                setError("Nepavyko gauti duomenų")
            } finally {
                setLoading(false)
            }
        }
        if (user?.role === "admin") {
            fetchData()
        }
    }, [user])

    if (loading) return <p>Kraunama...</p>

    return (
        <div className="admin-metrics">
            <Breadcrumb />
            <h1>Statistika</h1>
            {error ? (
                <p className="error">{error}</p>
            ) : totalOrders === 0 && revenue === 0 ? (
                <p>Įkeliama...</p>
            ) : (
                <>
                    <p><strong>Bendras užsakymų skaičius: </strong>{totalOrders}</p>
                    <p><strong>Bendra apyvarta: </strong>{(revenue ?? 0).toFixed(2)} €</p>
                </>
            )}

        </div>
    )
}

export default AdminMetrics