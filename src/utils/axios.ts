import axios from "axios"
import { jwtDecode } from "jwt-decode"

// Sukuriame Axios instanciją su bazine API nuoroda ir antraštėmis
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Funkcija, patikrinanti ar JWT tokenas yra pasibaigęs
const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token) 
    const now = Math.floor(Date.now() / 1000)
    return exp < now // Tikrina ar tokenas jau pasibaigęs
  } catch {
    return true 
  }
}

// Pridedame request interceptor'ų: prieš siunčiant užklausą
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token && token !== "undefined") {
      
      if (isTokenExpired(token)) {
        // Jei pasibaigęs – šaliname tokeną, nukreipiame į login puslapį
        localStorage.removeItem("token")
        if (window.location.pathname !== "/login") {
          window.location.replace("/login?sessionExpired=true")
        }
        return Promise.reject(new Error("Token expired"))
      }

      // Jei galioja – pridedame prie Authorization antraštės
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Pridedame response interceptor'ų: kai gaunamas atsakymas arba klaida
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Jei serveris grąžina 401 arba 403 – tokenas gali būti nebegaliojantis ar neautorizuotas
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token") 
      if (window.location.pathname !== "/login") {
        window.location.replace("/login?sessionExpired=true") // Peradresuojame į login
      }
    }
    return Promise.reject(error)
  }
)

export default api 
