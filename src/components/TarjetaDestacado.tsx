import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, fuentes, radio } from '@/constants/theme';

interface Props {
  etiqueta: string;
  nombre: string;
  detalle: string;
  puntos: string;
  onPress?: () => void;
}

export function TarjetaDestacado({ etiqueta, nombre, detalle, puntos, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.tarjeta, pressed && onPress && styles.presionada]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.datos}>
        <Text style={styles.etiqueta}>{etiqueta.toUpperCase()}</Text>
        <Text style={styles.nombre} numberOfLines={1} adjustsFontSizeToFit>
          {nombre}
        </Text>
        <Text style={styles.detalle} numberOfLines={2}>
          {detalle}
        </Text>
      </View>
      <View style={styles.puntos}>
        <Text style={styles.valor}>{puntos}</Text>
        <Text style={styles.etiqueta}>PTS</Text>
      </View>
      {onPress ? <Ionicons name="chevron-forward" size={18} color={colores.textoTenue} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    padding: espaciado.lg,
    backgroundColor: colores.naranjaSuave,
    borderWidth: 1,
    borderColor: colores.naranja,
    borderRadius: radio.md,
  },
  presionada: {
    opacity: 0.7,
  },
  datos: {
    flex: 1,
    gap: 2,
  },
  etiqueta: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colores.textoSecundario,
  },
  nombre: {
    fontFamily: fuentes.titulo,
    fontSize: 28,
    color: colores.texto,
  },
  detalle: {
    fontFamily: fuentes.texto,
    fontSize: 12,
    color: colores.textoSecundario,
  },
  puntos: {
    alignItems: 'center',
  },
  valor: {
    fontFamily: fuentes.titulo,
    fontSize: 36,
    color: colores.naranja,
  },
});
