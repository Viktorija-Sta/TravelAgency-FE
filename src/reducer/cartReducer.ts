import { CartState } from "../context/CartContext";
import { CartAction } from "../types/types";

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
        const existingItem = state.items.find(
            (item) => item._id === action.payload._id
          );
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((item) => item._id !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((item) =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
};