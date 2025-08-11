import { useNavigate, Link } from "react-router-dom"
import { useCart } from "../hooks/useCart"
import { toast } from "sonner"
import type { CartItem } from "../types/types"
import { 
  Avatar, Box, Button, Card, CardContent, Container, Divider, Grid, TextField, Typography, useMediaQuery 
} from "@mui/material"

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const isSmallScreen = useMediaQuery("(max-width:600px)")

  const removeItemHandler = (itemId: string) => {
    removeFromCart(itemId)
    toast.success("Prekė pašalinta iš krepšelio")
  }

  const updateQuantityHandler = (itemId: string, quantity: number) => {
    if (quantity < 1) return
    updateQuantity(itemId, quantity)
  }

  const checkoutHandler = () => {
    if (items.length === 0) {
      toast.error("Krepšelis tuščias")
      return
    }
    navigate("/checkout")
  }

  const continueShoppingHandler = () => {
    navigate("/")
  }

  const clearCartHandler = () => {
    clearCart()
    toast.success("Krepšelis išvalytas")
  }

  const renderRelatedHotel = (destinationItem: CartItem) => {
    return items.find(
      (item) =>
        item.modelType === "Hotel" &&
        item.details?.name?.toLowerCase().includes(destinationItem.name.toLowerCase())
    )
  }

  const getItemLink = (item: CartItem) => {
    if (item.modelType === "Destination") return `/destinations/${item._id}`
    if (item.modelType === "Hotel") return `/hotels/${item._id}`
    return "/"
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h4">Krepšelis tuščias</Typography>
        <Button variant="contained" onClick={continueShoppingHandler} sx={{ mt: 2 }}>
          Tęsti apsipirkimą
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>Jūsų krepšelis</Typography>
      <Grid container spacing={3}>
        {items.map((item) => {
          const isDestination = item.modelType === "Destination"
          const relatedHotel = isDestination ? renderRelatedHotel(item) : null
          const itemLink = getItemLink(item)

          return (
            <Grid size={{ xs: 12 }} key={item._id + item.modelType}>
              <Card 
                sx={{ 
                  display: "flex", 
                  flexDirection: isSmallScreen ? "column" : "row", 
                  alignItems: "center", 
                  padding: 2 
                }}
              >
                <Avatar
                  src={item.image || "/fallback.jpg"}
                  alt={item.name}
                  sx={{ width: 100, height: 100, marginRight: isSmallScreen ? 0 : 2, marginBottom: isSmallScreen ? 1 : 0 }}
                />
                <CardContent sx={{ flex: 1, textAlign: isSmallScreen ? "center" : "left" }}>
                  <Typography variant="h6">
                    <Link to={itemLink} style={{ textDecoration: "none", color: "#1976d2" }}>
                      {item.name}
                    </Link>
                  </Typography>
                  <Typography variant="body1">Kaina: {item.price.toFixed(2)} €</Typography>
                  <Box 
                    display="flex" 
                    flexDirection={isSmallScreen ? "column" : "row"} 
                    alignItems="center" 
                    gap={1} 
                    mt={1}
                  >
                    <Typography variant="body2">Kiekis:</Typography>
                    <TextField
                      type="number"
                      variant="outlined"
                      size="small"
                      value={item.quantity}
                      onChange={(e) => updateQuantityHandler(item._id, Number(e.target.value))}
                      sx={{ maxWidth: 80 }}
                    />
                    <Button 
                      variant="outlined" 
                      color="error" 
                      onClick={() => removeItemHandler(item._id)}
                      sx={{ marginLeft: isSmallScreen ? 0 : 2, marginTop: isSmallScreen ? 1 : 0 }}
                    >
                      Pašalinti
                    </Button>
                  </Box>
                  {isDestination && relatedHotel && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ mb: 1 }} />
                      <Typography variant="body2">Pasirinktas viešbutis:</Typography>
                      <Typography variant="body1">
                        <Link to={`/hotels/${relatedHotel._id}`} style={{ textDecoration: "none", color: "#1976d2" }}>
                          {relatedHotel.name}
                        </Link>
                      </Typography>
                      <Typography variant="body1">Kaina: {relatedHotel.price.toFixed(2)} €</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Iš viso: {getTotal().toFixed(2)} €</Typography>
        <Button 
          variant="outlined" 
          color="warning" 
          onClick={clearCartHandler} 
          sx={{ mr: 2 }}
        >
          Išvalyti krepšelį
        </Button>
        <Button variant="contained" color="primary" onClick={checkoutHandler}>
          Pateikti užsakymą
        </Button>
      </Box>
    </Container>
  )
}

export default CartPage
