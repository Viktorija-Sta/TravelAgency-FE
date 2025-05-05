import { useState, FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { AxiosError } from "axios"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const { login, user } = useAuth()

  const sessionExpired = new URLSearchParams(location.search).get("sessionExpired") === "true"

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      setEmail("")
      setPassword("")
      alert("Prisijungta!")

      if (user?.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/")
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>
      const message = axiosError.response?.data?.message || "Prisijungimas nepavyko"
      alert(message)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h1>Prisijungimas</h1>

      {sessionExpired && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          ⚠️ Jūsų sesija baigėsi. Prisijunkite iš naujo.
        </div>
      )}

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>El. paštas:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label>Slaptažodis:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Prisijungiama..." : "Prisijungti"}
        </button>
      </form>

      <p>
        Neturite paskyros? <Link to="/register">Registruotis</Link>
      </p>
    </div>
  )
}

export default Login
