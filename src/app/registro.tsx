import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/api/client';
import { Boton } from '@/components/Boton';
import { Campo } from '@/components/Campo';
import { PantallaFormulario } from '@/components/PantallaFormulario';
import { colores, espaciado, fuentes } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import type { RegistroRequest } from '@/types/auth';

type Formulario = RegistroRequest & { confirmacion: string };
type Errores = Partial<Record<keyof Formulario, string>>;

const FORMULARIO_VACIO: Formulario = {
  nombre: '',
  apellido: '',
  mail: '',
  usuario: '',
  password: '',
  confirmacion: '',
};

function validar(f: Formulario): Errores {
  const errores: Errores = {};
  if (!f.nombre.trim()) errores.nombre = 'Ingresá tu nombre.';
  if (!f.apellido.trim()) errores.apellido = 'Ingresá tu apellido.';
  if (!/^\S+@\S+\.\S+$/.test(f.mail.trim())) errores.mail = 'Ingresá un correo válido.';
  if (f.usuario.trim().length < 3 || f.usuario.trim().length > 50) {
    errores.usuario = 'Debe tener entre 3 y 50 caracteres.';
  }
  if (f.password.length < 8 || f.password.length > 72) {
    errores.password = 'Debe tener entre 8 y 72 caracteres.';
  }
  if (f.confirmacion !== f.password) errores.confirmacion = 'Las contraseñas no coinciden.';
  return errores;
}

export default function Registro() {
  const { registrarse } = useAuth();
  const [formulario, setFormulario] = useState<Formulario>(FORMULARIO_VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function actualizar(campo: keyof Formulario) {
    return (valor: string) => setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  async function enviar() {
    const erroresLocales = validar(formulario);
    setErrores(erroresLocales);
    setErrorGeneral(null);
    if (Object.keys(erroresLocales).length > 0) {
      return;
    }

    setEnviando(true);
    try {
      await registrarse({
        nombre: formulario.nombre.trim(),
        apellido: formulario.apellido.trim(),
        mail: formulario.mail.trim(),
        usuario: formulario.usuario.trim(),
        password: formulario.password,
      });
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
    <PantallaFormulario>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>CREAR CUENTA</Text>
        <Text style={styles.subtitulo}>Registrate para armar tu equipo fantasy.</Text>
      </View>

      <Campo etiqueta="Nombre" value={formulario.nombre} onChangeText={actualizar('nombre')} error={errores.nombre} />
      <Campo etiqueta="Apellido" value={formulario.apellido} onChangeText={actualizar('apellido')} error={errores.apellido} />
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
      <Campo
        etiqueta="Contraseña"
        value={formulario.password}
        onChangeText={actualizar('password')}
        error={errores.password}
        secureTextEntry
      />
      <Campo
        etiqueta="Repetir contraseña"
        value={formulario.confirmacion}
        onChangeText={actualizar('confirmacion')}
        error={errores.confirmacion}
        secureTextEntry
      />

      {errorGeneral ? <Text style={styles.error}>{errorGeneral}</Text> : null}

      <Boton titulo="Registrarme" onPress={enviar} cargando={enviando} />
      <Boton titulo="Ya tengo cuenta" variante="secundario" onPress={() => router.back()} deshabilitado={enviando} />
    </PantallaFormulario>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    gap: espaciado.xs,
  },
  titulo: {
    fontFamily: fuentes.titulo,
    fontSize: 28,
    color: colores.texto,
  },
  subtitulo: {
    fontFamily: fuentes.texto,
    fontSize: 14,
    color: colores.textoSecundario,
  },
  error: {
    fontFamily: fuentes.textoMedio,
    fontSize: 13,
    color: colores.negativo,
  },
});
