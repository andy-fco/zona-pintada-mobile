import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Marca } from '@/components/Marca';
import { colores, espaciado, fuentes, radio } from '@/constants/theme';

export function Encabezado() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.contenedor, { paddingTop: insets.top + espaciado.sm }]}>
      <View style={styles.logo}>
        <Ionicons name="basketball" size={22} color={colores.texto} />
      </View>
      <Marca medida={22} />
      <View style={styles.espacio} />
      <View style={styles.insignia}>
        <Text style={styles.insigniaTexto}>LNB</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    paddingHorizontal: espaciado.lg,
    paddingBottom: espaciado.md,
    backgroundColor: colores.fondo,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: radio.sm,
    backgroundColor: colores.naranja,
    alignItems: 'center',
    justifyContent: 'center',
  },
  espacio: {
    flex: 1,
  },
  insignia: {
    borderWidth: 1,
    borderColor: colores.naranja,
    borderRadius: radio.sm,
    paddingHorizontal: espaciado.sm,
    paddingVertical: 2,
    backgroundColor: colores.naranjaSuave,
  },
  insigniaTexto: {
    fontFamily: fuentes.subtitulo,
    fontSize: 13,
    color: colores.naranja,
  },
});
