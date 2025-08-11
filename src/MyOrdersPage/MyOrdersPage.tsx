import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import type { Order } from "../types/types"
import api from "../utils/axios"
import { Alert, Card, CardContent, CircularProgress, Container, List, Typography } from "@mui/material"

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

    if (loading) return (
        <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ marginTop: 2 }}>Kraunama...</Typography>
        </Container>
    )

    if (error) return (
        <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
            <Alert severity="error">{error}</Alert>
        </Container>
    )

    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>Mano užsakymai</Typography>
            {orders.length === 0 ? (
                <Typography variant="body1" color="text.secondary">Jūs neturite jokių užsakymų.</Typography>
            ) : (
                <List>
                    {orders.map((order) => (
                        <Card key={order._id} sx={{ marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h6">Užsakymo ID: {order._id}</Typography>
                                <Typography variant="body1">
                                    Data: {new Date(order.orderDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1">
                                    Bendra suma: {order.totalAmount} EUR
                                </Typography>
                                <Typography variant="body1">
                                    Statusas: {order.status}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </List>
            )}
        </Container>
    )
}

export default MyOrdersPage