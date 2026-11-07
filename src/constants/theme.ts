import { Platform } from 'react-native';

export const colores = {
  fondo: '#0B0B0B',
  superficie: '#111111',
  superficieElevada: '#1A1A1A',
  borde: '#262626',
  naranja: '#FF5C00',
  naranjaSuave: 'rgba(255, 92, 0, 0.12)',
  texto: '#FFFFFF',
  textoSecundario: '#A3A3A3',
  textoTenue: '#6B6B6B',
  positivo: '#22C55E',
  negativo: '#EF4444',
  cancha: '#181A19',
  lineaCancha: 'rgba(255, 255, 255, 0.18)',
} as const;

export const fuentes = {
  titulo: 'BarlowCondensed_800ExtraBold_Italic',
  subtitulo: 'BarlowCondensed_700Bold_Italic',
  texto: 'PlusJakartaSans_400Regular',
  textoMedio: 'PlusJakartaSans_600SemiBold',
  textoNegrita: 'PlusJakartaSans_700Bold',
  numeros: Platform.select({ ios: 'Menlo', default: 'monospace' }),
} as const;

export const espaciado = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radio = {
  sm: 6,
  md: 10,
  lg: 16,
  total: 999,
} as const;
