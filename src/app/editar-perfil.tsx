import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ApiError } from '@/api/client';
import { actualizarPerfil } from '@/api/usuarios';
import { Boton } from '@/components/Boton';
import { Campo } from '@/components/Campo';
import { Pantalla } from '@/components/Pantalla';
import { colores, fuentes } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import type { ActualizarPerfilRequest } from '@/types/auth';

type Errores = Partial<Record<keyof ActualizarPerfilRequest, string>>;

function validar(f: ActualizarPerfilRequest): Errores {
  const errores: Errores = {};
  if (!f.nombre.trim()) errores.nombre = 'Ingresá tu nombre.';
  if (!f.apellido.trim()) errores.apellido = 'Ingresá tu apellido.';
  if (!/^\S+@\S+\.\S+$/.test(f.mail.trim())) errores.mail = 'Ingresá un correo válido.';
  if (f.usuario.trim().length < 3 || f.usuario.trim().length > 50) {
    errores.usuario = 'Debe tener entre 3 y 50 caracteres.';
  }
  return errores;
}

export default function EditarPerfil() {
  const { usuario, actualizarUsuario } = useAuth();
  const [formulario, setFormulario] = useState<ActualizarPerfilRequest>({
    nombre: usuario?.nombre ?? '',
    apellido: usuario?.apellido ?? '',
    mail: usuario?.mail ?? '',
    usuario: usuario?.usuario ?? '',
  });
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function actualizar(campo: keyof ActualizarPerfilRequest) {
    return (valor: string) => setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  async function guardar() {
    const erroresLocales = validar(formulario);
    setErrores(erroresLocales);
    setErrorGeneral(null);
    if (Object.keys(erroresLocales).length > 0) {
      return;
    }

    setEnviando(true);
    try {
      const actualizado = await actualizarPerfil({
        nombre: formulario.nombre.trim(),
        apellido: formulario.apellido.trim(),
        mail: formulario.mail.trim(),
        usuario: formulario.usuario.trim(),
      });
      actualizarUsuario(actualizado);
      router.back();
    } catch (e) {
      if (e instanceof ApiError) {
        setErrores(e.errores);
        setErrorGeneral(e.message);
      } else {
        setErrorGeneral('Ocurrió un error inesperado.');
      }
      setEnviando(false);
    }
  }

  return (
    <Pantalla>
      <Campo etiqueta="Nombre" value={formulario.nombre} onChangeText={actualizar('nombre')} error={errores.nombre} />
      <Campo
        etiqueta="Apellido"
        value={formulario.apellido}
        onChangeText={actualizar('apellido')}
        error={errores.apellido}
      />
      <Campo
        etiqueta="Correo electrónico"
        value={formulario.mail}
        onChangeText={actualizar('mail')}
        error={errores.mail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <Campo
        etiqueta="Nombre de usuario"
        value={formulario.usuario}
        onChangeText={actualizar('usuario')}
        error={errores.usuario}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {errorGeneral ? <Text style={styles.error}>{errorGeneral}</Text> : null}

      <Boton titulo="Guardar cambios" onPress={guardar} cargando={enviando} />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  error: {
    fontFamily: fuentes.textoMedio,
    fontSize: 13,
    color: colores.negativo,
  },
});
