import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import * as authApi from '@/api/auth';
import { ApiError, registrarAlNoAutorizado } from '@/api/client';
import { borrarToken, guardarToken, leerToken } from '@/lib/tokenStorage';
import type { RegistroRequest, Usuario } from '@/types/auth';

interface Sesion {
  usuario: Usuario | null;
  cargando: boolean;
  iniciarSesion: (identificador: string, password: string) => Promise<void>;
  registrarse: (datos: RegistroRequest) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  actualizarUsuario: (usuario: Usuario) => void;
}

const MENSAJE_ADMINISTRADOR = 'Las cuentas de administrador se gestionan desde la web.';

async function obtenerManager() {
  const perfil = await authApi.obtenerMiPerfil();
  if (perfil.rol === 'administrador') {
    await borrarToken();
    throw new ApiError(403, MENSAJE_ADMINISTRADOR);
  }
  return perfil;
}

const AuthContext = createContext<Sesion | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function restaurarSesion() {
      try {
        const token = await leerToken();
        if (token) {
          setUsuario(await obtenerManager());
        }
      } catch {
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    }
    restaurarSesion();
  }, []);

  useEffect(() => {
    registrarAlNoAutorizado(() => {
      borrarToken();
      setUsuario(null);
    });
    return () => registrarAlNoAutorizado(null);
  }, []);

  async function iniciarSesion(identificador: string, password: string) {
    const { token } = await authApi.iniciarSesion({ identificador, password });
    await guardarToken(token);
    setUsuario(await obtenerManager());
  }

  async function registrarse(datos: RegistroRequest) {
    await authApi.registrarse(datos);
    await iniciarSesion(datos.usuario, datos.password);
  }

  async function cerrarSesion() {
    await borrarToken();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, cargando, iniciarSesion, registrarse, cerrarSesion, actualizarUsuario: setUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }
  return contexto;
}
