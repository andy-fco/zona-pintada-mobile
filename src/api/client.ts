import { leerToken } from '@/lib/tokenStorage';

const URL_BASE = process.env.EXPO_PUBLIC_API_URL;
const TIEMPO_MAXIMO_MS = 10000;

export class ApiError extends Error {
  status: number;
  errores: Record<string, string>;

  constructor(status: number, mensaje: string, errores: Record<string, string> = {}) {
    super(mensaje);
    this.status = status;
    this.errores = errores;
  }
}

let alNoAutorizado: (() => void) | null = null;

export function registrarAlNoAutorizado(accion: (() => void) | null) {
  alNoAutorizado = accion;
}

export async function api<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  if (!URL_BASE) {
    throw new ApiError(0, 'Falta configurar EXPO_PUBLIC_API_URL en .env.local.');
  }

  const token = await leerToken();

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_MAXIMO_MS);

  let respuesta: Response;
  try {
    respuesta = await fetch(`${URL_BASE}/api${ruta}`, {
      ...opciones,
      signal: controlador.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opciones.headers,
      },
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisá tu conexión.');
  } finally {
    clearTimeout(temporizador);
  }

  if (respuesta.status === 401 && token) {
    alNoAutorizado?.();
  }

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => null);
    throw new ApiError(
      respuesta.status,
      cuerpo?.mensaje ?? `Error ${respuesta.status}`,
      cuerpo?.errores ?? {},
    );
  }

  if (respuesta.status === 204) {
    return undefined as T;
  }
  return (await respuesta.json()) as T;
}
