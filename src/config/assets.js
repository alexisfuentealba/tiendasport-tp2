const IMG_BASE = '/img'

export const IMAGES = {
  logo: `${IMG_BASE}/logo.png`,
  portada: `${IMG_BASE}/portada.png`,
  portadaIntro: `${IMG_BASE}/portada1.png`,
  productoDefault: `${IMG_BASE}/productos/conjunto-hombre.jpg`,
  categorias: {
    hombre: `${IMG_BASE}/categorias/hombre.png`,
    mujer: `${IMG_BASE}/categorias/mujer.png`,
    ninos: `${IMG_BASE}/categorias/niños.png`,
    running: `${IMG_BASE}/categorias/running.png`,
  },
  productos: {
    conjuntoHombre: `${IMG_BASE}/productos/conjunto-hombre.jpg`,
    conjuntoMujer: `${IMG_BASE}/productos/conjunto-mujer.jpg`,
    conjuntoNinos: `${IMG_BASE}/productos/conjunto-niños.jpg`,
    conjuntoRunning: `${IMG_BASE}/productos/conjunto-running.jpg`,
  },
}

export const IMAGENES_PRODUCTO_OPCIONES = [
  { label: 'Conjunto Hombre', path: IMAGES.productos.conjuntoHombre },
  { label: 'Conjunto Mujer', path: IMAGES.productos.conjuntoMujer },
  { label: 'Conjunto Niños', path: IMAGES.productos.conjuntoNinos },
  { label: 'Conjunto Running', path: IMAGES.productos.conjuntoRunning },
  { label: 'Portada deportiva', path: IMAGES.portadaIntro },
]

export const IMAGENES_CATEGORIA_OPCIONES = [
  { label: 'Hombre', path: IMAGES.categorias.hombre },
  { label: 'Mujer', path: IMAGES.categorias.mujer },
  { label: 'Niños', path: IMAGES.categorias.ninos },
  { label: 'Running', path: IMAGES.categorias.running },
  { label: 'Portada deportiva', path: IMAGES.portadaIntro },
]

function resolverImagen(ruta, fallback) {
  if (!ruta || !ruta.trim()) {
    return fallback
  }

  const valor = ruta.trim()

  if (valor.startsWith('data:image/')) {
    return valor
  }

  if (valor.startsWith('/img/')) {
    return valor
  }

  if (valor.startsWith('img/')) {
    return `/${valor}`
  }

  return fallback
}

export function imagenProducto(avatar) {
  return resolverImagen(avatar, IMAGES.productoDefault)
}

export function imagenCategoria(avatar) {
  return resolverImagen(avatar, IMAGES.categorias.hombre)
}

export const LOGO_URL = IMAGES.logo
