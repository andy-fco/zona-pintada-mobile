import { api } from './client';
import type { Ranking } from '@/types/ranking';

export function obtenerRankingGeneral(pagina: number) {
  return api<Ranking>(`/rankings/general?pagina=${pagina}`);
}

export function obtenerRankingSemanal(semanaId: number, pagina: number) {
  return api<Ranking>(`/rankings/semanas/${semanaId}?pagina=${pagina}`);
}
