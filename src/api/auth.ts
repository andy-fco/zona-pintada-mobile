import { api } from './client';
import type { LoginRequest, LoginResponse, RegistroRequest, Usuario } from '@/types/auth';

export function iniciarSesion(datos: LoginRequest) {
  return api<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export function registrarse(datos: RegistroRequest) {
  return api<Usuario>('/usuarios/registro', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export function obtenerMiPerfil() {
  return api<Usuario>('/usuarios/me');
}
