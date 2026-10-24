import { BrowserRouter, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { StoreProvider, useStore } from './context/StoreContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import RequireAuth from './components/RequireAuth'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation, { Track } from './pages/OrderConfirmation'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StoreSetup from './seller/StoreSetup'
import SellerLayout from './seller/SellerLayout'
import Dashboard from './seller/Dashboard'
import Products from './seller/Products'
import Orders from './seller/Orders'
import Inventory from './seller/Inventory'
import Customers from './seller/Customers'
import Analytics from './seller/Analytics'
import Settings from './seller/Settings'
import AdminDashboard from './admin/AdminDashboard'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] pb-12">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

// The seller's shareable store link, e.g. /store/my-shop
function StoreLink() {
  const { slug } = useParams()
  const { settings } = useStore()
  return slug === settings.storeSlug ? <Home /> : <div className="empty">This store does not exist.</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AuthProvider>
          <CartProvider>
            <ScrollTop />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/store/:slug" element={<StoreLink />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order/:id" element={<OrderConfirmation />} />
                <Route path="/track" element={<Track />} />
                <Route path="*" element={<div className="empty">Page not found.</div>} />
              </Route>

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/setup" element={<RequireAuth role="seller"><StoreSetup /></RequireAuth>} />

              <Route path="/seller" element={<RequireAuth role="seller"><SellerLayout /></RequireAuth>}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="customers" element={<Customers />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="/admin" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}
