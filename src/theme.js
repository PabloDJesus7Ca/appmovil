/**
 * theme.js
 * Paleta de colores y estilos base de la app.
 * Inspiración: cielo nocturno + astronomía.
 */

export const COLORS = {
  // Fondos
  bg:         '#0a0e1a', // azul noche muy oscuro
  card:       '#131929', // azul oscuro para tarjetas
  cardBorder: '#1e2d4a', // borde suave azulado

  // Textos
  textPrimary:   '#e8edf5', // blanco azulado
  textSecondary: '#7a92b8', // gris-azul medio
  textMuted:     '#3d5270', // texto muy suave

  // Acentos
  accent:    '#4da6ff', // azul cielo
  accentAlt: '#a78bfa', // violeta estelar
  gold:      '#fbbf24', // dorado lunar
  danger:    '#ef4444', // rojo para borrar

  // Categorías (chips de color)
  catColors: {
    'Astronomía':             '#4da6ff',
    'Fenómeno atmosférico':   '#a78bfa',
    'Aves':                   '#34d399',
    'Aeronave / Objeto artificial': '#fbbf24',
    'Otro':                   '#7a92b8',
  },
};

export const FONT = {
  sm:   12,
  md:   14,
  lg:   16,
  xl:   20,
  xxl:  26,
};

export const RADIUS = {
  sm:  8,
  md:  12,
  lg:  18,
  full: 999,
};
