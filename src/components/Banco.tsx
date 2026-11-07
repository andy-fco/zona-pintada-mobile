import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { POSICIONES } from '@/constants/posiciones';
import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import type { Posicion } from '@/types/jugador';

interface Props {
  dt: ReactNode;
  descripcionDt: string;
  renderSuplente: (posicion: Posicion) => ReactNode;
}

export function Banco({ dt, descripcionDt, renderSuplente }: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>SUPLENTES</Text>
      <View style={styles.suplentes}>
        {POSICIONES.map((posicion) => (
          <View key={posicion} style={styles.lugar}>
            {renderSuplente(posicion)}
          </View>
        ))}
      </View>

      <View style={styles.separador} />

      <View style={styles.filaDt}>
        {dt}
        <View style={styles.textoDt}>
          <Text style={styles.etiqueta}>DIRECTOR TÉCNICO</Text>
          <Text style={styles.descripcion}>{descripcionDt}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: espaciado.md,
    padding: espaciado.md,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
  },
  etiqueta: {
    fontFamily: fuentes.textoMedio,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colores.textoSecundario,
  },
  suplentes: {
    flexDirection: 'row',
    gap: espaciado.xs + 2,
  },
  lugar: {
    flex: 1,
    alignItems: 'center',
  },
  separador: {
    height: 1,
    backgroundColor: colores.borde,
  },
  filaDt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.lg,
  },
  textoDt: {
    flex: 1,
    gap: espaciado.xs,
  },
  descripcion: {
    fontFamily: fuentes.texto,
    fontSize: 12,
    color: colores.textoSecundario,
  },
});
