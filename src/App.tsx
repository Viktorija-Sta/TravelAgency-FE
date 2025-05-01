import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import MainLayout from './layouts/MainLayout'
import HomePage from './Pages/HomePage'

function App() {

  return (
    <>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route  element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
                {/* <Route index element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> */}
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App
