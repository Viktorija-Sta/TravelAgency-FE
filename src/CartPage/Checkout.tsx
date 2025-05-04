import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/axios"
import { useCart } from "../context/CartContext"

const Checkout: React.FC = () => {
  const { items, getTotal, clearCart } = useCart()
  const [shippingAddress, setShippingAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const orderSubmitHandler = async () => {
    if (!shippingAddress.trim()) {
      alert("Prašome įvesti pristatymo adresą")
      return
    }

    if (items.length === 0) {
      alert("Krepšelis tuščias")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotal(),
        shippingAddress,
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
        <label htmlFor="address">Pristatymo adresas:</label>
        <input
          type="text"
          id="address"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Įveskite savo pristatymo adresą"
        />
      </div>

      {error && <p className="error">{error}</p>}

      <button onClick={orderSubmitHandler} disabled={loading}>
        {loading ? "Vykdoma..." : "Patvirtinti užsakymą"}
      </button>
    </div>
  )
}

export default Checkout
