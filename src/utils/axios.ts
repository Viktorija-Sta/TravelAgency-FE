import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Pridedam tokeną prie visų užklausų, jei jis yra
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Atsakymo interceptorius, kuris tvarko 401 ir 403 klaidas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
