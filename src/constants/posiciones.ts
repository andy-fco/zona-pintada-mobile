import type { Posicion } from '@/types/jugador';

export const POSICIONES: Posicion[] = ['base', 'escolta', 'alero', 'ala-pivot', 'pivot'];

export const NOMBRE_POSICION: Record<Posicion, string> = {
  base: 'Base',
  escolta: 'Escolta',
  alero: 'Alero',
  'ala-pivot': 'Ala-pívot',
  pivot: 'Pívot',
};

export const SIGLA_POSICION: Record<Posicion, string> = {
  base: 'B',
  escolta: 'E',
  alero: 'A',
  'ala-pivot': 'AP',
  pivot: 'P',
};
