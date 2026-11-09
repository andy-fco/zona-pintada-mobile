import type { Posicion } from './jugador';

export interface PosicionLiga {
  posicion: number;
  equipoId: number;
  equipoNombre: string;
  nombreCorto: string | null;
  escudoUrl: string | null;
  partidosJugados: number;
  ganados: number;
  perdidos: number;
  puntosAFavor: number;
  puntosEnContra: number;
  diferencia: number;
  puntos: number;
}

export interface JugadorDestacado {
  jugadorId: number;
  nombre: string;
  apellido: string;
  fotoUrl: string | null;
  posicion: Posicion;
  equipoNombre: string;
  partidosJugados: number;
  puntosFantasy: number;
}

export interface DestacadosSemana {
  semanaId: number;
  numeroSemana: number;
  mvp: JugadorDestacado | null;
  quintetoIdeal: JugadorDestacado[];
  lideres: JugadorDestacado[];
}

export type EstadoPartido = 'programado' | 'en_juego' | 'finalizado' | 'suspendido';

export interface Partido {
  id: number;
  equipoLocalId: number;
  equipoLocal: string;
  equipoVisitanteId: number;
  equipoVisitante: string;
  fechaCompetenciaId: number;
  fecha: string;
  hora: string;
  puntosLocal: number | null;
  puntosVisitante: number | null;
  estado: EstadoPartido;
}
