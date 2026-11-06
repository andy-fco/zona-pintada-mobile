import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, fuentes, radio } from '@/constants/theme';

interface Props {
  icono: ComponentProps<typeof Ionicons>['name'];
  mensaje: string;
}

export function EstadoVacio({ icono, mensaje }: Props) {
  return (
    <View style={styles.contenedor}>
      <Ionicons name={icono} size={32} color={colores.textoTenue} />
      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    gap: espaciado.sm,
    padding: espaciado.xl,
    borderWidth: 1,
    borderColor: colores.borde,
    borderStyle: 'dashed',
    borderRadius: radio.md,
  },
  mensaje: {
    fontFamily: fuentes.texto,
    fontSize: 14,
    textAlign: 'center',
    color: colores.textoSecundario,
  },
});
