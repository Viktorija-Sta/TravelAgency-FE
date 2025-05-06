import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/axios"
import { useCart } from "../context/CartContext"
import { toast } from "sonner"

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
    } catch (err) {
      console.error("Užsakymo klaida:", err)
      setError("Nepavyko pateikti užsakymo. Bandykite dar kartą.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-container">
      <h1>Užsakymo apžvalga</h1>

      <div className="checkout-items">
        {items.map((item) => (
          <div key={item._id} className="checkout-item">
            <img style={{ width: "300px" }} src={item.image} alt={item.name} />
            <div className="checkout-item-details">
              <h2>{item.name}</h2>
              <p>Kaina: {item.price.toFixed(2)} €</p>
              <p>Kiekis: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Bendra suma: {getTotal().toFixed(2)} €</h2>

      <div className="address-input">
        <label>Pristatymo adresas:</label>
        <input type="text" placeholder="Šalis" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
        <input type="text" placeholder="Miestas" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
        <input type="text" placeholder="Gatvė" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
        <input type="text" placeholder="Pašto kodas" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
      </div>

      {error && <p className="error">{error}</p>}

      <button onClick={orderSubmitHandler} disabled={loading}>
        {loading ? "Vykdoma..." : "Patvirtinti užsakymą"}
      </button>
    </div>
  )
}

export default Checkout
