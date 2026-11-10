import { api } from './client';
import type { ActualizarPerfilRequest, CambiarPasswordRequest, Usuario } from '@/types/auth';

export function actualizarPerfil(datos: ActualizarPerfilRequest) {
  return api<Usuario>('/usuarios/me', {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

export function cambiarPassword(datos: CambiarPasswordRequest) {
  return api<void>('/usuarios/me/password', {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

export function eliminarCuenta() {
  return api<void>('/usuarios/me', { method: 'DELETE' });
}
