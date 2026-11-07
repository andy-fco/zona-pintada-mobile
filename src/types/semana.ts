export interface Semana {
  id: number;
  temporadaId: number;
  numeroSemana: number;
  fechaInicio: string;
  fechaFin: string;
  createdAt: string;
  cerradaAt: string | null;
}
