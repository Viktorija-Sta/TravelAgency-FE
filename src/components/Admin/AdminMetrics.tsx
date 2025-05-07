import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import api from "../../utils/axios"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import { 
    Container, Typography, CircularProgress, Paper 
} from "@mui/material"

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
                setRevenue(res.data.totalRevenue || 0)
                setError(null)
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

    if (loading) return (
        <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ marginTop: 2 }}>Kraunama...</Typography>
        </Container>
      )
      
      if (error) return <Typography color="error">{error}</Typography>

    return (
        <Container maxWidth="md" sx={{ m: 4 }}>
            <Breadcrumb />
            <Typography variant="h4" gutterBottom>Statistika</Typography>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                {error ? (
                    <Typography variant="body1" color="error">{error}</Typography>
                ) : totalOrders === 0 && revenue === 0 ? (
                    <Typography variant="body1">Nėra statistikos duomenų</Typography>
                ) : (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Bendras užsakymų skaičius: <strong>{totalOrders}</strong>
                        </Typography>
                        <Typography variant="h6">
                            Bendra apyvarta: <strong>{(revenue ?? 0).toFixed(2)} €</strong>
                        </Typography>
                    </>
                )}
            </Paper>
        </Container>
    )
}

export default AdminMetrics
