import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, fuentes } from '@/constants/theme';

interface Props {
  etiqueta: string;
  titulo: string;
}

export function TituloSeccion({ etiqueta, titulo }: Props) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.fila}>
        <View style={styles.punto} />
        <Text style={styles.etiqueta}>{etiqueta.toUpperCase()}</Text>
      </View>
      <Text style={styles.titulo}>{titulo.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: 2,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.xs,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colores.naranja,
  },
  etiqueta: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colores.naranja,
  },
  titulo: {
    fontFamily: fuentes.titulo,
    fontSize: 30,
    color: colores.texto,
  },
});
