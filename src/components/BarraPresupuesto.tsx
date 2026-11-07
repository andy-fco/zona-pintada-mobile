import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import { formatearValor } from '@/lib/formato';

interface Props {
  gastado: number;
  maximo: number;
}

export function BarraPresupuesto({ gastado, maximo }: Props) {
  const disponible = maximo - gastado;
  const excedido = disponible < 0;
  const porcentaje = Math.min((gastado / maximo) * 100, 100);

  return (
    <View style={styles.tarjeta}>
      <View style={styles.fila}>
        <Dato etiqueta="Tope" valor={formatearValor(maximo)} />
        <Dato etiqueta="Invertido" valor={formatearValor(gastado)} />
        <Dato
          etiqueta="Disponible"
          valor={formatearValor(disponible)}
          color={excedido ? colores.negativo : colores.positivo}
        />
      </View>
      <View style={styles.pista}>
        <View
          style={[
            styles.relleno,
            { width: `${porcentaje}%`, backgroundColor: excedido ? colores.negativo : colores.naranja },
          ]}
        />
      </View>
    </View>
  );
}

function Dato({ etiqueta, valor, color = colores.texto }: { etiqueta: string; valor: string; color?: string }) {
  return (
    <View style={styles.dato}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={[styles.valor, { color }]}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    gap: espaciado.md,
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 16,
    fontWeight: '700',
  },
  pista: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colores.superficieElevada,
    overflow: 'hidden',
  },
  relleno: {
    height: '100%',
    borderRadius: 3,
  },
});
