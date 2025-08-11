import type { AuthAction, AuthState } from "../types/types"

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case 'LOGIN':
        return { user: action.payload }
      case 'LOGOUT':
        return { user: null }
      default:
        return state
    }
  }
        
        