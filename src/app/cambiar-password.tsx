import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ApiError } from '@/api/client';
import { cambiarPassword } from '@/api/usuarios';
import { Boton } from '@/components/Boton';
import { Campo } from '@/components/Campo';
import { ModalOpciones } from '@/components/ModalOpciones';
import { Pantalla } from '@/components/Pantalla';
import { colores, fuentes } from '@/constants/theme';
import type { CambiarPasswordRequest } from '@/types/auth';

type Formulario = CambiarPasswordRequest & { confirmacion: string };
type Errores = Partial<Record<keyof Formulario, string>>;

function validar(f: Formulario): Errores {
  const errores: Errores = {};
  if (!f.passwordActual) errores.passwordActual = 'Ingresá tu contraseña actual.';
  if (f.passwordNueva.length < 8 || f.passwordNueva.length > 72) {
    errores.passwordNueva = 'Debe tener entre 8 y 72 caracteres.';
  }
  if (f.confirmacion !== f.passwordNueva) errores.confirmacion = 'Las contraseñas no coinciden.';
  return errores;
}

export default function CambiarPassword() {
  const [formulario, setFormulario] = useState<Formulario>({
    passwordActual: '',
    passwordNueva: '',
    confirmacion: '',
  });
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);

  function actualizar(campo: keyof Formulario) {
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
      await cambiarPassword({
        passwordActual: formulario.passwordActual,
        passwordNueva: formulario.passwordNueva,
      });
      setListo(true);
    } catch (e) {
      if (e instanceof ApiError) {
        setErrores(e.errores);
        setErrorGeneral(e.message);
      } else {
        setErrorGeneral('Ocurrió un error inesperado.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Pantalla>
        <Campo
          etiqueta="Contraseña actual"
          value={formulario.passwordActual}
          onChangeText={actualizar('passwordActual')}
          error={errores.passwordActual}
          secureTextEntry
        />
        <Campo
          etiqueta="Contraseña nueva"
          value={formulario.passwordNueva}
          onChangeText={actualizar('passwordNueva')}
          error={errores.passwordNueva}
          secureTextEntry
        />
        <Campo
          etiqueta="Repetir contraseña nueva"
          value={formulario.confirmacion}
          onChangeText={actualizar('confirmacion')}
          error={errores.confirmacion}
          secureTextEntry
        />

        {errorGeneral ? <Text style={styles.error}>{errorGeneral}</Text> : null}

        <Boton titulo="Cambiar contraseña" onPress={guardar} cargando={enviando} />
      </Pantalla>

      {listo ? (
        <ModalOpciones
          titulo="Contraseña actualizada"
          mensaje="La próxima vez que inicies sesión, usá la contraseña nueva."
          opciones={[]}
          textoCerrar="Volver al perfil"
          onCerrar={() => router.back()}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  error: {
    fontFamily: fuentes.textoMedio,
    fontSize: 13,
    color: colores.negativo,
  },
});
