export type Posicion = 'base' | 'escolta' | 'alero' | 'ala-pivot' | 'pivot';

export interface Jugador {
  id: number;
  nombre: string;
  apellido: string;
  fotoUrl: string | null;
  fechaNacimiento: string | null;
  ciudad: string | null;
  altura: number | null;
  posicion: Posicion;
  manoHabil: string | null;
  pais: string | null;
  valor: number;
  equipoId: number;
  equipoNombre: string;
}

export interface DT {
  id: number;
  nombre: string;
  apellido: string;
  fotoUrl: string | null;
  fechaNacimiento: string | null;
  ciudad: string | null;
  pais: string | null;
  valor: number;
  equipoId: number;
  equipoNombre: string;
}
