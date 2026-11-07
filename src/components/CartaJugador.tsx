import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colores, espaciado, fuentes, radio } from '@/constants/theme';

export const ANCHO_CARTA = 68;

interface Props {
  etiqueta: string;
  nombre: string | null;
  dato?: string;
  insignia?: string | null;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function CartaJugador({ etiqueta, nombre, dato, insignia, onPress, style }: Props) {
  const vacia = nombre === null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.carta, vacia ? styles.vacia : styles.ocupada, pressed && styles.presionada, style]}
    >
      <Text style={styles.etiqueta} numberOfLines={1} adjustsFontSizeToFit>
        {etiqueta.toUpperCase()}
      </Text>

      <View style={styles.foto}>
        <Ionicons
          name={vacia ? 'add' : 'person'}
          size={vacia ? 20 : 30}
          color={vacia ? colores.textoSecundario : colores.textoTenue}
        />
      </View>

      <Text style={[styles.nombre, vacia && styles.nombreVacio]} numberOfLines={1} adjustsFontSizeToFit>
        {vacia ? 'Elegir' : nombre}
      </Text>
      {dato ? (
        <Text style={styles.dato} numberOfLines={1}>
          {dato}
        </Text>
      ) : null}

      {insignia ? (
        <View style={styles.insignia}>
          <Text style={styles.insigniaTexto}>{insignia}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carta: {
    width: ANCHO_CARTA,
    paddingVertical: espaciado.xs,
    paddingHorizontal: 3,
    borderRadius: radio.sm,
    borderWidth: 1,
    alignItems: 'center',
    gap: 3,
  },
  vacia: {
    borderStyle: 'dashed',
    borderColor: colores.textoTenue,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  ocupada: {
    borderColor: colores.naranja,
    backgroundColor: colores.superficie,
  },
  presionada: {
    opacity: 0.7,
  },
  etiqueta: {
    alignSelf: 'stretch',
    fontFamily: fuentes.textoMedio,
    fontSize: 9,
    letterSpacing: 0.4,
    textAlign: 'center',
    color: colores.textoSecundario,
  },
  foto: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: radio.sm,
    backgroundColor: colores.superficieElevada,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  nombre: {
    alignSelf: 'stretch',
    fontFamily: fuentes.textoMedio,
    fontSize: 11,
    textAlign: 'center',
    color: colores.texto,
  },
  nombreVacio: {
    color: colores.textoSecundario,
  },
  dato: {
    fontFamily: fuentes.numeros,
    fontSize: 10,
    color: colores.textoSecundario,
  },
  insignia: {
    position: 'absolute',
    top: -7,
    right: -7,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 2,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.naranja,
  },
  insigniaTexto: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 9,
    color: colores.texto,
  },
});
