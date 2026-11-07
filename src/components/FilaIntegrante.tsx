import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import { formatearPuntos } from '@/lib/formato';

interface Props {
  sigla: string;
  nombre: string;
  detalle: string;
  puntos: number;
  ultimoPartido: string | null;
  destacado?: boolean;
}

export function FilaIntegrante({ sigla, nombre, detalle, puntos, ultimoPartido, destacado = false }: Props) {
  return (
    <View style={styles.fila}>
      <View style={[styles.sigla, destacado && styles.siglaDestacada]}>
        <Text style={[styles.siglaTexto, destacado && styles.siglaTextoDestacada]}>{sigla}</Text>
      </View>
      <View style={styles.datos}>
        <Text style={styles.nombre} numberOfLines={1}>
          {nombre}
        </Text>
        <Text style={styles.detalle} numberOfLines={1}>
          {detalle}
        </Text>
        {ultimoPartido ? <Text style={styles.partido}>{ultimoPartido}</Text> : null}
      </View>
      <View style={styles.puntos}>
        <Text style={styles.puntosValor}>{formatearPuntos(puntos)}</Text>
        <Text style={styles.puntosEtiqueta}>PTS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    padding: espaciado.md,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
  },
  sigla: {
    width: 36,
    height: 36,
    borderRadius: radio.sm,
    borderWidth: 1,
    borderColor: colores.borde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  siglaDestacada: {
    borderColor: colores.naranja,
    backgroundColor: colores.naranjaSuave,
  },
  siglaTexto: {
    fontFamily: fuentes.subtitulo,
    fontSize: 14,
    color: colores.textoSecundario,
  },
  siglaTextoDestacada: {
    color: colores.naranja,
  },
  datos: {
    flex: 1,
    gap: 2,
  },
  nombre: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 14,
    color: colores.texto,
  },
  detalle: {
    fontFamily: fuentes.texto,
    fontSize: 12,
    color: colores.textoSecundario,
  },
  partido: {
    fontFamily: fuentes.texto,
    fontSize: 11,
    color: colores.textoTenue,
  },
  puntos: {
    alignItems: 'flex-end',
  },
  puntosValor: {
    fontFamily: fuentes.numeros,
    fontSize: 18,
    fontWeight: '700',
    color: colores.texto,
  },
  puntosEtiqueta: {
    fontFamily: fuentes.texto,
    fontSize: 10,
    color: colores.textoTenue,
  },
});
