import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer/CartDrawer'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRouter from './components/ProtectedRouter'
import { useAuthContext } from './context/AuthContext'
import { esRutaAdmin } from './config/routes'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Detail from './pages/Detail'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminProductos from './pages/AdminProductos'
import CartRedirect from './pages/CartRedirect'
import ServiciosRedirect from './pages/ServiciosRedirect'
import MisCompras from './pages/MisCompras'
import NotFound from './pages/NotFound'
import './App.css'

function DashboardRoute() {
  return (
    <ProtectedRouter soloAdmin>
      <Dashboard />
    </ProtectedRouter>
  )
}

function AdminProductosRoute() {
  return (
    <ProtectedRouter soloAdmin>
      <AdminProductos />
    </ProtectedRouter>
  )
}

function App() {
  const location = useLocation()
  const { esAdmin: sesionAdmin } = useAuthContext()
  const esLogin = location.pathname === '/login'
  const esRutaAdminActual = esRutaAdmin(location.pathname)
  const mostrarTienda = !esLogin && !esRutaAdminActual

  return (
    <div className="app-wrapper">
      <ScrollToTop />
      {mostrarTienda && <Navbar />}
      {mostrarTienda && !sesionAdmin && <CartDrawer />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<ServiciosRedirect />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<Detail />} />
        <Route path="/carrito" element={<CartRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/mis-compras"
          element={
            <ProtectedRouter>
              <MisCompras />
            </ProtectedRouter>
          }
        />

        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/gestion-productos" element={<AdminProductosRoute />} />
        <Route path="/formulario-producto" element={<AdminProductosRoute />} />
        <Route path="/categorias" element={<AdminProductosRoute />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {mostrarTienda && <Footer />}
    </div>
  )
}

export default App
