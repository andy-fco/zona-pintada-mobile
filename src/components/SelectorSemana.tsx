import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, fuentes } from '@/constants/theme';
import { formatearDiaMes } from '@/lib/formato';
import type { Semana } from '@/types/semana';

interface Props {
  semana: Semana;
  puedeRetroceder: boolean;
  puedeAvanzar: boolean;
  onRetroceder: () => void;
  onAvanzar: () => void;
}

export function SelectorSemana({ semana, puedeRetroceder, puedeAvanzar, onRetroceder, onAvanzar }: Props) {
  return (
    <View style={styles.contenedor}>
      <Pressable onPress={onRetroceder} disabled={!puedeRetroceder} hitSlop={10}>
        <Ionicons name="chevron-back" size={24} color={puedeRetroceder ? colores.texto : colores.borde} />
      </Pressable>
      <View style={styles.textos}>
        <Text style={styles.titulo}>SEMANA {semana.numeroSemana}</Text>
        <Text style={styles.detalle}>
          {formatearDiaMes(semana.fechaInicio)} al {formatearDiaMes(semana.fechaFin)} ·{' '}
          {semana.cerradaAt ? 'Cerrada' : 'En curso'}
        </Text>
      </View>
      <Pressable onPress={onAvanzar} disabled={!puedeAvanzar} hitSlop={10}>
        <Ionicons name="chevron-forward" size={24} color={puedeAvanzar ? colores.texto : colores.borde} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: espaciado.sm,
  },
  textos: {
    alignItems: 'center',
    gap: 2,
  },
  titulo: {
    fontFamily: fuentes.subtitulo,
    fontSize: 20,
    color: colores.texto,
  },
  detalle: {
    fontFamily: fuentes.texto,
    fontSize: 12,
    color: colores.textoSecundario,
  },
});
