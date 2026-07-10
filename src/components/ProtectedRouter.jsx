import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

function ProtectedRouter({ children, soloAdmin = false }) {
  const { usuario, cargando } = useAuthContext()
  const location = useLocation()

  if (cargando) {
    return (
      <div className="loading-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (soloAdmin && usuario.rol !== 'admin') {
    return <Navigate to="/productos" replace />
  }

  return children
}

export default ProtectedRouter
