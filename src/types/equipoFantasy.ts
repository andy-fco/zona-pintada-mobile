import type { Posicion } from './jugador';

export type RolPlantel = 'normal' | 'capitan' | 'sexto_hombre';

export interface JugadorDelEquipo {
  id: number;
  nombre: string;
  apellido: string;
  valor: number;
  equipoId: number;
  equipoNombre: string;
  titular: boolean;
  rol: RolPlantel;
  multiplicador: number;
  posicion: Posicion;
}

export interface DTDelEquipo {
  id: number;
  nombre: string;
  apellido: string;
  valor: number;
  equipoId: number;
  equipoNombre: string;
}

export interface EquipoFantasy {
  id: number;
  nombre: string;
  usuarioId: number;
  usuario: string;
  temporadaId: number;
  temporadaNombre: string;
  presupuestoMaximo: number;
  presupuestoUtilizado: number;
  presupuestoRestante: number;
  tokensTraspaso: number;
  puntosSemana: number;
  puntosTotales: number;
  dt: DTDelEquipo;
  jugadores: JugadorDelEquipo[];
}

export interface JugadorPlantelRequest {
  jugadorId: number;
  titular: boolean;
  rol: RolPlantel;
}

export interface SugerenciaEquipo {
  dtId: number;
  jugadores: JugadorPlantelRequest[];
}

export interface CrearEquipoRequest {
  nombre: string;
  dtId: number;
  jugadores: JugadorPlantelRequest[];
}

export interface PartidoPuntos {
  partidoId: number;
  fecha: string;
  rival: string;
  puntosFantasy: number;
  puntosAportados: number;
}

export interface IntegrantePuntos {
  id: number;
  nombre: string;
  apellido: string;
  posicion: Posicion | null;
  equipoNombre: string;
  titular: boolean | null;
  rol: RolPlantel | null;
  multiplicador: number;
  puntosSemana: number;
  partidos: PartidoPuntos[];
}

export interface PuntosSemanaEquipo {
  semanaId: number;
  numeroSemana: number;
  cerrada: boolean;
  puntosEquipo: number;
  jugadores: IntegrantePuntos[];
  dt: IntegrantePuntos | null;
}
