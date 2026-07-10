export const RUTAS_ADMIN = [
  '/dashboard',
  '/gestion-productos',
  '/formulario-producto',
  '/categorias',
]

export const RUTAS_PANEL_PRODUCTOS = [
  '/gestion-productos',
  '/formulario-producto',
  '/categorias',
]

export function esRutaAdmin(pathname) {
  return RUTAS_ADMIN.includes(pathname)
}

export function esPanelProductos(pathname) {
  return RUTAS_PANEL_PRODUCTOS.includes(pathname)
}
