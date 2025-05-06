import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
// import './App.css'

import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import MainLayout from './layouts/MainLayout'
import HomePage from './Pages/HomePage'
import Login from './Pages/Login'
import Register from './Pages/Register'

import DestinationsPage from './Pages/DestinationsPage'
import DestinationItem from './components/ItemPage/DestinationItem'
import HotelsPage from './Pages/HotelsPage'
import HotelItem from './components/ItemPage/HotelItem'

import AgenciesPage from './Pages/AgenciesPage'
import AgencyItem from './components/ItemPage/AgencyItem'

import CartPage from './CartPage/CartPage'
import Checkout from './CartPage/Checkout'
import OrderSuccessPage from './CartPage/OrderSuccessPage'

import ReviewsPage from './components/Review/ReviewsPage'
import ProfilePage from './components/Profile/ProfilePage'
import MyOrdersPage from './MyOrdersPage/MyOrdersPage'

import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/Admin/AdminRoute'
import AdminPanel from './components/Admin/AdminPanel'
import AdminOrders from './components/Admin/AdminOrders'
import AdminProducts from './components/Admin/AdminProducts'
import AdminMetrics from './components/Admin/AdminMetrics'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
    <Toaster richColors position="top-right" />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>

              <Route element={<MainLayout />}>

                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destinations/:id" element={<DestinationItem />} />

                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/hotels/:id" element={<HotelItem />} />

                <Route path="/agencies" element={<AgenciesPage />} />
                <Route path="/agencies/:id" element={<AgencyItem />} />

                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />

                <Route path="/reviews" element={<ReviewsPage />} />

                <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/my-orders" element={
                    <ProtectedRoute>
                      <MyOrdersPage />
                    </ProtectedRoute>
                  }
                />

                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/admin/metrics" element={<AdminMetrics />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                </Route>

              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App
