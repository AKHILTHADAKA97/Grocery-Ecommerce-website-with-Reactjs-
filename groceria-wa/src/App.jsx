import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { OrdersProvider } from './context/OrdersContext'
import { WishlistProvider } from './context/WishlistContext'
import ProtectedRoute from './components/ProtectedRoute'
import HelpFab from './components/HelpFab'
import SupportWhatsAppFab from './components/SupportWhatsAppFab'
import AdminCalendarFab from './components/AdminCalendarFab'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function FloatingActions() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  if (isAdmin) return <AdminCalendarFab />
  return (
    <>
      <HelpFab />
      <SupportWhatsAppFab />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrdersProvider>
          <WishlistProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/c/:catId" element={<CategoryPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <FloatingActions />
            </CartProvider>
          </WishlistProvider>
        </OrdersProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
