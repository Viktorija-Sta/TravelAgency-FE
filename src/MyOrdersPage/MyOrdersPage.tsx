import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { Order } from "../types/types"
import api from "../utils/axios"

const MyOrdersPage: React.FC = () => {
    const { token, userId } = useAuth()
    const [orders, setOrders] = useState<Order[]>([]) 
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get(`/orders/my-orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setOrders(response.data)
            } catch {
                setError("Nepavyko gauti užsakymų")
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [token, userId])

    if (loading) return <div>Kraunama...</div>
    if (error) return <div>{error}</div>

    return (
        <div>
            <h1>Mano užsakymai</h1>
            {orders.length === 0 ? (
                <p>Jūs neturite jokių užsakymų.</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        
                            <li key={order._id}>
                                <h2>Užsakymo ID: {order._id}</h2>
                                <p>Data: {new Date(order.orderDate).toLocaleDateString()}</p>
                                <p>Bendra suma: {order.totalAmount} EUR</p>
                                <p>Statusas: {order.status}</p>
                            </li>
                        
                    ))}
                </ul>
            )}
        </div>
    )
}

export default MyOrdersPage