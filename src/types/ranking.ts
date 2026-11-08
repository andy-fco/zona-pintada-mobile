export interface PosicionRanking {
  posicion: number;
  equipoFantasyId: number;
  nombreEquipo: string;
  usuarioId: number;
  usuario: string;
  puntos: number;
}

export interface Ranking {
  pagina: number;
  totalPaginas: number;
  totalEquipos: number;
  miPosicion: PosicionRanking | null;
  posiciones: PosicionRanking[];
}
