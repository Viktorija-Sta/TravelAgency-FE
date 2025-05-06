import { useNavigate } from "react-router"
import { useCart } from "../hooks/useCart"

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
  const navigate = useNavigate()

    const removeItemHandler = (itemId: string) => {
        removeFromCart(itemId)
        alert("Prekė pašalinta iš krepšelio")
    }
    const updateQuantityHandler = (itemId: string, quantity: number) => {
        if (quantity < 1) return
        updateQuantity(itemId, quantity)
        
    }
    const checkoutHandler = () => {
        if (items.length === 0) {
            alert("Krepšelis tuščias")
            return
        }
        navigate("/checkout")
    }
    const continueShoppingHandler = () => {
        navigate("/")
    }
    if (items.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Krepšelis tuščias</h2>
                <button onClick={continueShoppingHandler}>Tęsti apsipirkimą</button>
            </div>
        )
    }

    const clearCartHandler = () => {
        clearCart()
        alert("Krepšelis išvalytas")
    }




  return (
    <div className="cart-page">
      <h1>Jūsų krepšelis</h1>
      <div className="cart-items">
        {items.map((item) => {
          const isDestination = item.modelType === "Destination"
          const relatedHotel = isDestination ? renderRelatedHotel(item) : null

          return (
            <div key={item._id + item.modelType} className="cart-item" style={{ marginBottom: "2rem" }}>
              <img
                style={{ width: "300px" }}
                src={item.image || "/fallback.jpg"}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h2>{item.name}</h2>
                <p>Kaina: {item.price.toFixed(2)} €</p>
                <label>
                  Kiekis:
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantityHandler(item._id, Number(e.target.value))}
                  />
                </label>
                <button onClick={() => removeItemHandler(item._id)}>Pašalinti</button>

                {isDestination && relatedHotel && (
                  <div className="related-hotel" style={{ marginTop: "1rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
                    <h3>Pasirinktas viešbutis:</h3>
                    <p>{relatedHotel.name}</p>
                    <p>Kaina: {relatedHotel.price.toFixed(2)} €</p>
                    <img
                      src={relatedHotel.image || "/fallback.jpg"}
                      alt={relatedHotel.name}
                      style={{ width: "200px", marginTop: "0.5rem" }}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="cart-total">
        <h2>Iš viso: {getTotal().toFixed(2)} €</h2>
        <button onClick={clearCartHandler}>Išvalyti krepšelį</button>
        <button onClick={checkoutHandler}>Pateikti užsakymą</button>
      </div>
    </div>
  )
}

export default CartPage
