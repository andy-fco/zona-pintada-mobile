import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import type { PosicionRanking } from '@/types/ranking';

interface Props {
  fila: PosicionRanking;
  propia: boolean;
  onPress: () => void;
}

export function FilaRanking({ fila, propia, onPress }: Props) {
  const podio = fila.posicion <= 3;

  return (
    <Pressable
      style={({ pressed }) => [styles.fila, propia && styles.propia, pressed && styles.presionada]}
      onPress={onPress}
    >
      <Text style={[styles.posicion, podio && styles.posicionPodio]}>{fila.posicion}</Text>
      <View style={styles.datos}>
        <Text style={styles.equipo} numberOfLines={1}>
          {fila.nombreEquipo}
        </Text>
        <Text style={styles.usuario} numberOfLines={1}>
          @{fila.usuario}
        </Text>
      </View>
      <Text style={styles.puntos}>{fila.puntos}</Text>
      <Ionicons name="chevron-forward" size={16} color={colores.textoTenue} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.md,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
  },
  propia: {
    borderColor: colores.naranja,
    backgroundColor: colores.naranjaSuave,
  },
  presionada: {
    opacity: 0.6,
  },
  posicion: {
    width: 28,
    textAlign: 'center',
    fontFamily: fuentes.titulo,
    fontSize: 22,
    color: colores.textoSecundario,
  },
  posicionPodio: {
    color: colores.naranja,
  },
  datos: {
    flex: 1,
    gap: 2,
  },
  equipo: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 14,
    color: colores.texto,
  },
  usuario: {
    fontFamily: fuentes.texto,
    fontSize: 12,
    color: colores.textoSecundario,
  },
  puntos: {
    fontFamily: fuentes.numeros,
    fontSize: 16,
    fontWeight: '700',
    color: colores.texto,
  },
});
