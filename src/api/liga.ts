import { api } from './client';
import type { DestacadosSemana, Partido, PosicionLiga } from '@/types/liga';

export function obtenerPosiciones() {
  return api<PosicionLiga[]>('/posiciones');
}

export function obtenerDestacados(semanaId: number) {
  return api<DestacadosSemana>(`/semanas/${semanaId}/destacados`);
}

export function listarPartidos(semanaId: number) {
  return api<Partido[]>(`/partidos?semanaId=${semanaId}`);
}
