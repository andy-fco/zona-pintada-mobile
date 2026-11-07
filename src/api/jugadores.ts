import { api } from './client';
import type { DT, Jugador } from '@/types/jugador';

export function listarJugadores() {
  return api<Jugador[]>('/jugadores');
}

export function listarDts() {
  return api<DT[]>('/dts');
}
