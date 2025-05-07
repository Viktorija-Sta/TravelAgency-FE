import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/axios"
import { useCart } from "../context/CartContext"
import { toast } from "sonner"
import { 
  Container, TextField, Button, Typography, Box, Card, CardContent, Grid, CircularProgress, Alert 
} from "@mui/material"

const Checkout: React.FC = () => {
  const { items, getTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: '',
  })

  const navigate = useNavigate()

  const orderSubmitHandler = async () => {
    const { street, city, postalCode, country } = address

    if (!street || !city || !postalCode || !country) {
      toast.error("Užpildykite visus pristatymo adreso laukus")
      return
    }

    if (items.length === 0) {
      toast.error("Krepšelis tuščias")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          modelType: item.modelType,
        })),
        totalAmount: getTotal(),
        shippingAddress: address,
      }

      await api.post("/orders", orderData)
      clearCart()
      navigate("/order-success")
      toast.success("Užsakymas sėkmingai pateiktas!")
    } catch (err) {
      console.error("Užsakymo klaida:", err)
      setError("Nepavyko pateikti užsakymo. Bandykite dar kartą.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>Užsakymo apžvalga</Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <img 
                  src={item.image || "/fallback.jpg"} 
                  alt={item.name} 
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} 
                />
                <Typography variant="h6" gutterBottom>{item.name}</Typography>
                <Typography variant="body1">Kaina: {item.price.toFixed(2)} €</Typography>
                <Typography variant="body2">Kiekis: {item.quantity}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>
        Bendra suma: {getTotal().toFixed(2)} €
      </Typography>

      <Box 
        component="form" 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 2, 
          marginTop: 2, 
          padding: 2, 
          border: "1px solid #ddd", 
          borderRadius: 2 
        }}
      >
        <Typography variant="h6">Pristatymo adresas</Typography>

        <TextField
          label="Šalis"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Miestas"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Gatvė"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Pašto kodas"
          value={address.postalCode}
          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
          fullWidth
          required
        />

        <Button 
          variant="contained" 
          color="primary" 
          onClick={orderSubmitHandler} 
          disabled={loading}
          sx={{ marginTop: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Patvirtinti užsakymą"}
        </Button>
      </Box>
    </Container>
  )
}

export default Checkout
