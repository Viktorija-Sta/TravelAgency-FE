import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import api from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import type { User } from '../types/types'
import { toast } from 'sonner'
import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material'

function Register() {
  const { login } = useAuth()

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.username) {
      toast.info('Visi privalomi laukai turi būti užpildyti')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Slaptažodžiai nesutampa')
      return
    }

    try {
      setIsLoading(true)

      const res = await api.post('/users/register', {
        email: formData.email,
        password: formData.password,
        username: formData.username
      })

      const { token } = res.data

      const decoded = jwtDecode<{
        id: string
        email: string
        username: string
        role: string
      }>(token)

      const newUser: User = {
        _id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role === 'admin' ? 'admin' : 'user',
        token,
      }

      localStorage.setItem('token', token)
      login(newUser.email, formData.password)

      toast.success('Sėkmingai prisiregistravote ir prisijungėte!')

      navigate('/')
      console.error('Registracijos klaida:', error)
      setError('Įvyko klaida registruojantis. Bandykite dar kartą.')
      console.error('Registracijos klaida:', error)

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>

        toast.error(axiosError.response?.data?.message || 'Registracijos klaida')
      } else {
        toast.error('Registracijos klaida')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ marginTop: 4 }}>
      <Box
        component="form"
        onSubmit={submitHandler}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          marginBottom: '30px',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Registracija
        </Typography>
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Vartotojo vardas"
          name="username"
          value={formData.username}
          onChange={changeHandler}
          required
          fullWidth
        />

        <TextField
          label="El. paštas"
          name="email"
          type="email"
          value={formData.email}
          onChange={changeHandler}
          required
          fullWidth
        />

        <TextField
          label="Slaptažodis"
          name="password"
          type="password"
          value={formData.password}
          onChange={changeHandler}
          required
          fullWidth
          inputProps={{ minLength: 6 }}
        />

        <TextField
          label="Pakartoti slaptažodį"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={changeHandler}
          required
          fullWidth
          inputProps={{ minLength: 6 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          fullWidth
          sx={{ mt: 1 }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Registruotis'}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Jau turite paskyrą? <Link to="/login">Prisijunkite</Link>
        </Typography>
      </Box>
    </Container>
  )
}

export default Register
