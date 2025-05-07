import { useState, FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from "@mui/material"

function Login() {
  const { login, user } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const sessionExpired = new URLSearchParams(location.search).get("sessionExpired") === "true"

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError("")
    setIsLoading(true)

    try {
      await login(email, password)

      setEmail("")
      setPassword("")
      toast.success("Prisijungta!")

      if (user?.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/")
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>
      const message = axiosError.response?.data?.message || "Prisijungimas nepavyko"

      toast.error(message)
      
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
    <Box
      component="form"
      onSubmit={submitHandler}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#f9f9f9",
        marginBottom: "30px"
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Prisijungimas
      </Typography>

      {sessionExpired && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          Jūsų sesija baigėsi. Prisijunkite iš naujo.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="El. paštas"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
        fullWidth
      />

      <TextField
        label="Slaptažodis"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading}
        fullWidth
        sx={{ mt: 1 }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Prisijungti"
        )}
      </Button>

      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
        Neturite paskyros? <Link to="/register">Registruotis</Link>
      </Typography>
    </Box>
  </Container>
)
}


export default Login
