export type RolUsuario = 'manager' | 'administrador';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  usuario: string;
  rol: RolUsuario;
}

export interface LoginRequest {
  identificador: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  expiraEn: number;
}

export interface RegistroRequest {
  nombre: string;
  apellido: string;
  mail: string;
  usuario: string;
  password: string;
}

export interface ActualizarPerfilRequest {
  nombre: string;
  apellido: string;
  mail: string;
  usuario: string;
}

export interface CambiarPasswordRequest {
  passwordActual: string;
  passwordNueva: string;
}
