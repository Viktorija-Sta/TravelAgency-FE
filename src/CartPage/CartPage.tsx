import { useNavigate } from "react-router"
import { useCart } from "../hooks/useCart"
import { toast } from "sonner"

const CartPage: React.FC = () => {
    const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
    const navigate = useNavigate()

    const removeItemHandler = (itemId: string) => {
        removeFromCart(itemId)
        toast.warning("Prekė pašalinta iš krepšelio")
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
        toast.success("Krepšelis išvalytas")
    }




    return (
        <div className="cart-page">
        <h1>Jūsų krepšelis</h1>
        <div className="cart-items">
          {items.map((item) => (
            <div key={item._id} className="cart-item">
              <img style={{width: '300px'}}
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
                    onChange={(e) =>
                        updateQuantityHandler(item._id, Number(e.target.value))
                    }
                  />
                </label>
                <button onClick={() => removeItemHandler(item._id)}>Pašalinti</button>
              </div>
            </div>
          ))}
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