import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import MainLayout from './layouts/MainLayout'
import HomePage from './Pages/HomePage'
import DestinationsPage from './Pages/DestinationsPage'
import Login from './Pages/Login'
import Register from './Pages/Register'
import ReviewsPage from './Pages/ReviewsPage'
import DestinationItem from './ItemPage/DestinationItem'

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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path='/destinations' element={<DestinationsPage />} />
              <Route path='/destinations/:id' element={<DestinationItem />} />


              <Route path='/reviews' element={<ReviewsPage />} />
               
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App
