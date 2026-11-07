import { api } from './client';
import type { CrearEquipoRequest, EquipoFantasy, PuntosSemanaEquipo, SugerenciaEquipo } from '@/types/equipoFantasy';

export function obtenerMiEquipo() {
  return api<EquipoFantasy>('/equipos-fantasy/me');
}

export function crearEquipo(datos: CrearEquipoRequest) {
  return api<EquipoFantasy>('/equipos-fantasy', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export function obtenerPuntosSemana(semanaId: number) {
  return api<PuntosSemanaEquipo>(`/equipos-fantasy/me/semanas/${semanaId}`);
}

export function obtenerSugerencia() {
  return api<SugerenciaEquipo>('/equipos-fantasy/sugerencia');
}
