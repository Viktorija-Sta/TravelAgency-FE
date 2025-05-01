import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { jwtDecode } from "jwt-decode";
import { User } from "../types/types";

  
  interface DecodedToken {
    _id: string
    name: string
    email: string
    username: string
    role?: string
    exp: number
    iat: number
  }
  
  interface AuthContextType {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    loading: boolean
    userId: string | null
  }
  
  type AuthProviderProps = {
    children: React.ReactNode
}
  const AuthContext = createContext<AuthContextType | undefined>(undefined)
  export { AuthContext }
  
  export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const userId = user ? user._id : null
  
    useEffect(() => {
      const savedToken = localStorage.getItem("token")
  
      if (savedToken && savedToken !== "undefined") {
        try {
          const decoded = jwtDecode<DecodedToken>(savedToken)
          console.log("🚀 ~ useEffect ~ decoded:", decoded)
          setToken(savedToken);
          setUser({
            _id: decoded._id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role === "user" || decoded.role === "admin" ? decoded.role : "user",
            token: savedToken,
          })
          setIsAuthenticated(true)
        } catch (err) {
          console.error("Klaida dekoduojant tokeną:", err)
          logout()
        }
      }
      setLoading(false)
    }, [])
  
    const login = async (email: string, password: string) => {
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      })
      console.log("🚀 ~ login ~ response:", response.data)
  
      const { token } = response.data
      const decoded = jwtDecode<DecodedToken>(token)
      console.log("🚀 ~ login ~ decoded:", decoded)
      const user: User = {
        _id: decoded._id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role === "user" || decoded.role === "admin" ? decoded.role : "user",
        token: token,
      }

      console.log("🚀 ~ login ~ user:", user);

      setToken(token)
      setUser(user)
      setIsAuthenticated(true);
  
      if (token) {
        localStorage.setItem("token", token)
      }
  
      setUser(user)
      setIsAuthenticated(true)
    }
  
    const logout = () => {
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      console.log("👋 Vartotojas atsijungė")
      alert(" Atsijungėte")
    }
  
    return (
      <AuthContext.Provider
        value={{ user, token, isAuthenticated, login, logout, loading, userId }}
      >
        {children}
      </AuthContext.Provider>
    )
  }
  
  export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider")
    }
  
    return context
  }
  