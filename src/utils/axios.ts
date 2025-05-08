import axios from "axios"
import {jwtDecode} from "jwt-decode"

// Dinamiškas bazinis URL pagal aplinką
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Funkcija patikrinti, ar JWT tokenas yra pasibaigęs
const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token)
    const now = Math.floor(Date.now() / 1000)
    return exp < now
  } catch {
    return true
  }
}

// Užklausos interceptorius
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token && token !== "undefined") {
      if (isTokenExpired(token)) {
        localStorage.removeItem("token")
        if (window.location.pathname !== "/login") {
          window.location.replace("/login?sessionExpired=true")
        }
        return Promise.reject(new Error("Token expired"))
      }

      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Atsakymo interceptorius
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("token")
      if (window.location.pathname !== "/login") {
        window.location.replace("/login?sessionExpired=true")
      }
    }
    return Promise.reject(error)
  }
)

export default api
