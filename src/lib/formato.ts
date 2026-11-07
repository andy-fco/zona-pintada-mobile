export function redondear(valor: number) {
  return Math.round(valor * 10) / 10;
}

export function formatearValor(valor: number) {
  return `$${redondear(valor).toFixed(1)}M`;
}

export function formatearPuntos(puntos: number) {
  return redondear(puntos).toFixed(1);
}

export function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
