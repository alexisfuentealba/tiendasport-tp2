import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="container page-content text-center">
      <h1 className="page-title">404 — Página no encontrada</h1>
      <p className="mb-4">La ruta que buscás no existe.</p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </main>
  )
}

export default NotFound
