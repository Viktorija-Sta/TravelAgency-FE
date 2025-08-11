import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import type { Order } from "../../types/types"
import api from "../../utils/axios"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import { toast } from "sonner"
import {
    Container, Typography, Table, TableHead, TableRow, TableCell,
    TableBody, Select, MenuItem, CircularProgress, Box, Paper, TableContainer
} from "@mui/material"

interface OrderRowProps {
    order: Order
    statusChangeHandler: (orderId: string, newStatus: Order['status']) => void
}

const OrderRow: React.FC<OrderRowProps> = ({ order, statusChangeHandler }) => {
    const address = order.shippingAddress

    return (
        <TableRow key={order._id}>
            <TableCell sx={{ wordBreak: "break-word" }}>{order._id}</TableCell>
            <TableCell>{order.user?.email}</TableCell>
            <TableCell>{order.items.map(item => item.details?.name || "N/A").join(", ")}</TableCell>
            <TableCell>{order.totalAmount} €</TableCell>
            <TableCell sx={{ maxWidth: 200, whiteSpace: "normal", wordBreak: "break-word" }}>
                {address?.street}, {address?.city}, {address?.postalCode}, {address?.country}
            </TableCell>
            <TableCell>
                <Select
                    value={order.status}
                    onChange={(e) => statusChangeHandler(order._id, e.target.value as Order['status'])}
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="pending">Laukiama</MenuItem>
                    <MenuItem value="canceled">Atšaukta</MenuItem>
                    <MenuItem value="shipped">Išsiųsta</MenuItem>
                    <MenuItem value="delivered">Pristatyta</MenuItem>
                </Select>
            </TableCell>
            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
        </TableRow>
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
            await api.put(`/admin/orders/${orderId}`, { status: newStatus })
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            )
            toast.success("Užsakymo būsena atnaujinta")
        } catch {
            toast.error("Nepavyko atnaujinti užsakymo būsenos")
        }
    }

    if (!user || user.role !== 'admin') {
        return <Typography color="error">Neturite teisių peržiūrėti puslapį</Typography>
    }

    if (loading) return (
        <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ marginTop: 2 }}>Kraunama...</Typography>
        </Container>
      )
      
      if (error) return <Typography color="error">{error}</Typography>

    if (orders.length === 0) return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6">Užsakymų nėra</Typography>
        </Box>
    )

    return (
        <Container maxWidth="lg" sx={{ m: 5 }}>
            <Breadcrumb />
            <Typography variant="h4" gutterBottom>Užsakymų valdymas</Typography>
            <Paper elevation={3} sx={{ p: 2,  m: 5 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="orders table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ maxWidth: 150, whiteSpace: "nowrap" }}>Užsakymo ID</TableCell>
                                <TableCell sx={{ maxWidth: 150, whiteSpace: "nowrap" }}>Vartotojo el. paštas</TableCell>
                                <TableCell>Produktai</TableCell>
                                <TableCell>Bendra suma</TableCell>
                                <TableCell sx={{ maxWidth: 300 }}>Adresas</TableCell>
                                <TableCell>Statusas</TableCell>
                                <TableCell>Data</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map(order => (
                                <OrderRow key={order._id} order={order} statusChangeHandler={statusChangeHandler} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    )
}

export default AdminOrders
