import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/api/client';
import { eliminarCuenta } from '@/api/usuarios';
import { MenuDesplegable } from '@/components/MenuDesplegable';
import { ModalOpciones } from '@/components/ModalOpciones';
import { Pantalla } from '@/components/Pantalla';
import { TituloSeccion } from '@/components/TituloSeccion';
import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function Perfil() {
  const { usuario, cerrarSesion } = useAuth();
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!usuario) {
    return null;
  }

  async function eliminar() {
    setConfirmando(false);
    setEliminando(true);
    setError(null);
    try {
      await eliminarCuenta();
      await cerrarSesion();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No se pudo eliminar la cuenta.');
      setEliminando(false);
    }
  }

  return (
    <>
      <Pantalla>
        <TituloSeccion etiqueta="Tu cuenta" titulo="Perfil" />

        <View style={styles.tarjeta}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={34} color={colores.naranja} />
          </View>
          <View style={styles.datos}>
            <Text style={styles.nombre} numberOfLines={1} adjustsFontSizeToFit>
              {`${usuario.nombre} ${usuario.apellido}`.toUpperCase()}
            </Text>
            <Text style={styles.secundario}>@{usuario.usuario}</Text>
            <Text style={styles.secundario}>{usuario.mail}</Text>
          </View>
          <View style={styles.menu}>
            <MenuDesplegable
              opciones={[
                { texto: 'Cerrar sesión', icono: 'log-out-outline', onPress: cerrarSesion },
                {
                  texto: 'Eliminar cuenta',
                  icono: 'trash-outline',
                  peligro: true,
                  onPress: () => setConfirmando(true),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.lista}>
          <FilaOpcion icono="create-outline" texto="Editar datos" onPress={() => router.push('/editar-perfil')} />
          <View style={styles.separador} />
          <FilaOpcion
            icono="lock-closed-outline"
            texto="Cambiar contraseña"
            onPress={() => router.push('/cambiar-password')}
          />
        </View>

        {eliminando ? <Text style={styles.aviso}>Eliminando tu cuenta…</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </Pantalla>

      {confirmando ? (
        <ModalOpciones
          titulo="Eliminar cuenta"
          mensaje="Se van a borrar tu cuenta y tu equipo fantasy, con todos sus puntos. Esta acción no se puede deshacer."
          opciones={[{ texto: 'Eliminar definitivamente', variante: 'peligro', onPress: eliminar }]}
          onCerrar={() => setConfirmando(false)}
        />
      ) : null}
    </>
  );
}

function FilaOpcion({
  icono,
  texto,
  onPress,
}: {
  icono: ComponentProps<typeof Ionicons>['name'];
  texto: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.fila, pressed && styles.presionada]} onPress={onPress}>
      <Ionicons name={icono} size={20} color={colores.textoSecundario} />
      <Text style={styles.textoFila}>{texto}</Text>
      <Ionicons name="chevron-forward" size={18} color={colores.textoTenue} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.lg,
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colores.naranja,
    backgroundColor: colores.naranjaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datos: {
    flex: 1,
    gap: 2,
  },
  menu: {
    alignSelf: 'flex-start',
  },
  nombre: {
    fontFamily: fuentes.titulo,
    fontSize: 24,
    color: colores.texto,
  },
  secundario: {
    fontFamily: fuentes.texto,
    fontSize: 13,
    color: colores.textoSecundario,
  },
  lista: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
    overflow: 'hidden',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    paddingVertical: espaciado.md + 2,
    paddingHorizontal: espaciado.lg,
  },
  presionada: {
    backgroundColor: colores.superficieElevada,
  },
  separador: {
    height: 1,
    marginLeft: espaciado.lg,
    backgroundColor: colores.borde,
  },
  textoFila: {
    flex: 1,
    fontFamily: fuentes.textoMedio,
    fontSize: 15,
    color: colores.texto,
  },
  aviso: {
    fontFamily: fuentes.textoMedio,
    fontSize: 13,
    textAlign: 'center',
    color: colores.textoSecundario,
  },
  error: {
    fontFamily: fuentes.textoMedio,
    fontSize: 13,
    textAlign: 'center',
    color: colores.negativo,
  },
});
