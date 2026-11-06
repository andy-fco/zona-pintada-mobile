import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Boton } from '@/components/Boton';
import { Marca } from '@/components/Marca';
import { colores, espaciado, fuentes } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function Inicio() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <SafeAreaView style={styles.contenedor}>
      <Marca />
      <Text style={styles.etiqueta}>Bienvenido,</Text>
      <Text style={styles.nombre}>
        {usuario?.nombre} {usuario?.apellido}
      </Text>
      <Text style={styles.dato}>@{usuario?.usuario} · {usuario?.rol}</Text>
      <Boton titulo="Cerrar sesión" variante="secundario" onPress={cerrarSesion} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
    padding: espaciado.xl,
    gap: espaciado.md,
  },
  etiqueta: {
    fontFamily: fuentes.texto,
    fontSize: 13,
    color: colores.textoSecundario,
    marginTop: espaciado.xl,
  },
  nombre: {
    fontFamily: fuentes.titulo,
    fontSize: 32,
    color: colores.texto,
  },
  dato: {
    fontFamily: fuentes.texto,
    fontSize: 14,
    color: colores.textoSecundario,
  },
});
