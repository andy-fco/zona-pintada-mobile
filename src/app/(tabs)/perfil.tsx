import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Pantalla } from '@/components/Pantalla';
import { TituloSeccion } from '@/components/TituloSeccion';
import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function Perfil() {
  const { usuario, cerrarSesion } = useAuth();

  if (!usuario) {
    return null;
  }

  const iniciales = `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();

  return (
    <Pantalla>
      <View style={styles.tarjeta}>
        <View style={styles.avatar}>
          <Text style={styles.iniciales}>{iniciales}</Text>
        </View>
        <View style={styles.datos}>
          <Text style={styles.nombre}>{`${usuario.nombre} ${usuario.apellido}`.toUpperCase()}</Text>
          <Text style={styles.secundario}>@{usuario.usuario}</Text>
          <Text style={styles.secundario}>{usuario.mail}</Text>
        </View>
      </View>

      <TituloSeccion etiqueta="Cuenta" titulo="Sesión" />
      <Boton titulo="Cerrar sesión" variante="secundario" onPress={cerrarSesion} />
    </Pantalla>
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
  iniciales: {
    fontFamily: fuentes.titulo,
    fontSize: 26,
    color: colores.naranja,
  },
  datos: {
    flex: 1,
    gap: 2,
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
});
