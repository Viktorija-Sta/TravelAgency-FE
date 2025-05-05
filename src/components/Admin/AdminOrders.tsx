import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { Order } from "../../types/types"
import api from "../../utils/axios"
import Breadcrumb from "../Breadcrumb/Breadcrumb"

interface OrderRowProps {
    order: Order
    statusChangeHandler: (orderId: string, newStatus: Order['status']) => void
}

const OrderRow: React.FC<OrderRowProps> = ({ order, statusChangeHandler }) => {

    return (
        <tr key={order._id}>
            <td>{order._id}</td>
            <td>{order.user?.email}</td>
            <td>{order.items.map(item => item.details?.name || "N/A").join(", ")}</td>
            <td>{order.totalAmount} €</td>
            <td>{order.shippingAddress}</td>
            <td>
                <select value={order.status} onChange={(e) => statusChangeHandler(order._id, e.target.value)}>
                    <option value="pending">Laukiama</option>
                    <option value="shipped">Išsiųsta</option>
                    <option value="delivered">Pristatyta</option>
                </select>
            </td>
            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
    )
}

const AdminOrders: React.FC = () => {
    const { user } = useAuth()

    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    const fetchOrders = async () => {
        try {
            setLoading(true) 
            const res = await api.get<Order[]>('/admin/orders')
            setOrders(res.data || [])
            setError(null)
        } catch {
            setError("Nepavyko gauti užsakymų")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [user])

    const statusChangeHandler = async (orderId: string, newStatus: Order['status']) => {
        try {
            await api.put(`admin/orders/${orderId}`, {status: newStatus})

            setOrders(prevOrders => 
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            )
            alert("Užsakymo būsena atnaujinta")
        } catch {
            alert("Nepavyko atnaujinti užsakymo būsenos")
        }
    }

    if (!user || user.role !== 'admin') {
        return <div className="admin-error">Neturite teisių peržiūrėti puslapį</div>
    }

    if (loading) return <div>Kraunama...</div>
    if (error) return <div>{error}</div>

    if(orders.length === 0) return <div>Užsakymų nėra</div>

    return (
        <>
            <div className="admin-Orders">
                <Breadcrumb />
                <h1>UŽsakymų valdymas</h1>
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Užsakymo ID</th>
                            <th>Vartotojo el. paštas</th>
                            <th>Produktai</th>
                            <th>Bendra suma</th>
                            <th>Adresas</th>
                            <th>Statusas</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <OrderRow key={order._id} order={order} statusChangeHandler={statusChangeHandler} />
                        ))}
                    </tbody>
                </table>
            </div>

            
        </>
    )
}

export default AdminOrders