import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import MainLayout from './layouts/MainLayout'
import HomePage from './Pages/HomePage'
import DestinationsPage from './Pages/DestinationsPage'
import Login from './Pages/Login'
import Register from './Pages/Register'
import ReviewsPage from './Review/ReviewsPage'
import DestinationItem from './ItemPage/DestinationItem'
import HotelItem from './ItemPage/HotelItem'
import AgenciesPage from './Pages/AgenciesPage'
import AgencyItem from './ItemPage/AgencyItem'
import ProtectedRoute from './components/ProtectedRoute'
import CartPage from './CartPage/CartPage'
import HotelsPage from './Pages/HotelsPage'
import Checkout from './CartPage/Checkout'
import OrderSuccessPage from './CartPage/OrderSuccessPage'
import MyOrdersPage from './MyOrdersPage/MyOrdersPage'
import ProfilePage from './Profile/ProfilePage'


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

              <Route path='/hotels' element={<HotelsPage />} />
              <Route path='/hotels/:id' element={<HotelItem />} />

              <Route path='/agencies' element={<AgenciesPage />} />
              <Route path='/agencies/:id' element={<AgencyItem />} />

              <Route path='/cart' element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />

              <Route path='/reviews' element={<ReviewsPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/my-orders" element={
                <ProtectedRoute>
                  <MyOrdersPage />
                </ProtectedRoute>
              } />

               
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App
