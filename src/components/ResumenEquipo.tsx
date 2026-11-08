import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, fuentes, radio } from '@/constants/theme';

export interface DatoResumen {
  etiqueta: string;
  valor: string;
  destacado?: boolean;
}

export function ResumenEquipo({ datos }: { datos: DatoResumen[] }) {
  return (
    <View style={styles.resumen}>
      {datos.map((dato) => (
        <View key={dato.etiqueta} style={styles.dato}>
          <Text style={styles.etiqueta}>{dato.etiqueta}</Text>
          <Text style={[styles.valor, dato.destacado && styles.destacado]}>{dato.valor}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  resumen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
  },
  dato: {
    gap: 2,
  },
  etiqueta: {
    fontFamily: fuentes.texto,
    fontSize: 11,
    color: colores.textoSecundario,
  },
  valor: {
    fontFamily: fuentes.numeros,
    fontSize: 22,
    fontWeight: '700',
    color: colores.texto,
  },
  destacado: {
    color: colores.naranja,
  },
});
