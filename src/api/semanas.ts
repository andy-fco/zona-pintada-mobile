import { api } from './client';
import type { Semana } from '@/types/semana';

export function obtenerSemanaActual() {
  return api<Semana>('/semanas/actual');
}

export function listarSemanas() {
  return api<Semana[]>('/semanas');
}
