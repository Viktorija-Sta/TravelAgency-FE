import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import api from '../utils/axios'
import { useAuth } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  })
  const [isLoading, setIsLoading] = useState(false)

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
      alert('Visi laukai yra privalomi')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Slaptažodžiai nesutampa')
      return
    }

    try {
      setIsLoading(true)

      // Pirma registracija
      await api.post('/users/register', {
        email: formData.email,
        password: formData.password,
        username: formData.username,
      })

      // Tada automatinis prisijungimas
      await login(formData.email, formData.password)

      alert('Sėkmingai prisiregistravote ir prisijungėte!')
      navigate('/')

    } catch (error) {
      console.error('Registracijos klaida:', error)

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>
        alert(axiosError.response?.data?.message || 'Registracijos klaida')
      } else {
        alert('Registracijos klaida')
      }

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-container">
      <h1>Registracija</h1>
      <form onSubmit={submitHandler} className="register-form">
        <div className="form-group">
          <label>Vartotojo vardas:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={changeHandler}
            required
          />
        </div>
        <div className="form-group">
          <label>El. paštas:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            required
          />
        </div>
        <div className="form-group">
          <label>Slaptažodis:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            required
            minLength={6}
          />
        </div>
        <div className="form-group">
          <label>Pakartoti slaptažodį:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={changeHandler}
            required
            minLength={6}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registruojama...' : 'Registruotis'}
        </button>
      </form>
      <p className="login-link">
        Jau turite paskyrą? <Link to="/login">Prisijunkite</Link>
      </p>
    </div>
  )
}

export default Register
