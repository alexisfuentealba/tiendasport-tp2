import AdminNavbar from './AdminNavbar/AdminNavbar'

function AdminLayout({ titulo, children }) {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-main">
        {titulo && (
          <header className="admin-header">
            <h1>{titulo}</h1>
          </header>
        )}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
