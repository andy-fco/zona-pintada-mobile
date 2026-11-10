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

export function formatearDiaMes(fecha: string) {
  const [, mes, dia] = fecha.split('-');
  return `${dia}/${mes}`;
}

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function formatearDiaSemana(fecha: string) {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return `${DIAS[new Date(anio, mes - 1, dia).getDay()]} ${formatearDiaMes(fecha)}`;
}

export function fechaLocalIso(fecha: Date) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}
