import { createContext, useReducer, useEffect, useContext } from "react"
import type { ReactNode } from "react"
import { cartReducer } from "../reducer/cartReducer"
import type { CartItem } from "../types/types"

export interface CartState {
  items: CartItem[]
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export { CartContext }


export function CartProvider({ children }: { children: ReactNode }) {
  const initCart = (): CartState => {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? { items: JSON.parse(savedCart) } : { items: [] }
  }

  const [state, dispatch] = useReducer(cartReducer, { items: [] }, initCart)

  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(state.items))
    } else {
      localStorage.removeItem("cart")
    }
  }, [state.items])

  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })

    
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getTotal = () => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}


 export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
      throw new Error("useAuth must be used within an CartProvider")
    }
  
    return context
  }
