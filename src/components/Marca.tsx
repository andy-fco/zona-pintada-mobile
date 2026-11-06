import { StyleSheet, Text, View } from 'react-native';

import { colores, fuentes } from '@/constants/theme';

interface Props {
  medida?: number;
}

export function Marca({ medida = 28 }: Props) {
  return (
    <View>
      <Text style={[styles.nombre, { fontSize: medida }]}>
        ZONA <Text style={styles.acento}>PINTADA</Text>
      </Text>
      <Text style={styles.bajada}>FANTASY OFICIAL · LNB</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nombre: {
    fontFamily: fuentes.titulo,
    color: colores.texto,
  },
  acento: {
    color: colores.naranja,
  },
  bajada: {
    fontFamily: fuentes.textoMedio,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colores.textoSecundario,
  },
});
