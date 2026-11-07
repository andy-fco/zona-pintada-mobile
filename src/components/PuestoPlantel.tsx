import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import { formatearValor } from '@/lib/formato';

interface Ocupante {
  nombre: string;
  apellido: string;
  equipoNombre: string;
  valor: number;
}

interface Marcador {
  texto: string;
  activo: boolean;
  onPress: () => void;
}

interface Props {
  sigla: string;
  etiqueta: string;
  ocupante: Ocupante | null;
  onElegir: () => void;
  onQuitar: () => void;
  marcador?: Marcador;
}

export function PuestoPlantel({ sigla, etiqueta, ocupante, onElegir, onQuitar, marcador }: Props) {
  if (!ocupante) {
    return (
      <Pressable style={[styles.puesto, styles.vacio]} onPress={onElegir}>
        <View style={styles.sigla}>
          <Text style={styles.siglaTexto}>{sigla}</Text>
        </View>
        <Text style={styles.textoVacio}>Elegir {etiqueta.toLowerCase()}</Text>
        <Ionicons name="add-circle-outline" size={22} color={colores.naranja} />
      </Pressable>
    );
  }

  return (
    <View style={styles.puesto}>
      <View style={[styles.sigla, styles.siglaOcupada]}>
        <Text style={[styles.siglaTexto, styles.siglaTextoOcupada]}>{sigla}</Text>
      </View>
      <View style={styles.datos}>
        <Text style={styles.nombre} numberOfLines={1}>
          {ocupante.nombre} {ocupante.apellido}
        </Text>
        <Text style={styles.detalle} numberOfLines={1}>
          {ocupante.equipoNombre} · {formatearValor(ocupante.valor)}
        </Text>
      </View>
      {marcador ? (
        <Pressable
          style={[styles.marcador, marcador.activo && styles.marcadorActivo]}
          onPress={marcador.onPress}
          hitSlop={8}
        >
          <Text style={[styles.marcadorTexto, marcador.activo && styles.marcadorTextoActivo]}>
            {marcador.texto}
          </Text>
        </Pressable>
      ) : null}
      <Pressable onPress={onQuitar} hitSlop={8}>
        <Ionicons name="close-circle" size={22} color={colores.textoTenue} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  puesto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    minHeight: 60,
    paddingHorizontal: espaciado.md,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
  },
  vacio: {
    borderStyle: 'dashed',
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
  siglaOcupada: {
    borderColor: colores.naranja,
    backgroundColor: colores.naranjaSuave,
  },
  siglaTexto: {
    fontFamily: fuentes.subtitulo,
    fontSize: 14,
    color: colores.textoTenue,
  },
  siglaTextoOcupada: {
    color: colores.naranja,
  },
  textoVacio: {
    flex: 1,
    fontFamily: fuentes.textoMedio,
    fontSize: 14,
    color: colores.textoSecundario,
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
  marcador: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: espaciado.xs,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colores.borde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcadorActivo: {
    backgroundColor: colores.naranja,
    borderColor: colores.naranja,
  },
  marcadorTexto: {
    fontFamily: fuentes.subtitulo,
    fontSize: 13,
    color: colores.textoTenue,
  },
  marcadorTextoActivo: {
    color: colores.texto,
  },
});
