import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { ANCHO_CARTA } from '@/components/CartaJugador';
import { POSICIONES } from '@/constants/posiciones';
import { colores, radio } from '@/constants/theme';
import type { Posicion } from '@/types/jugador';

const ANCHO_VISTA = 150;
const ALTO_VISTA = 160;
const GROSOR = 0.6;

const UBICACION: Record<Posicion, { vertical: number; horizontal: number }> = {
  base: { vertical: 0.03, horizontal: 0.5 },
  escolta: { vertical: 0.29, horizontal: 0.18 },
  alero: { vertical: 0.29, horizontal: 0.82 },
  'ala-pivot': { vertical: 0.57, horizontal: 0.22 },
  pivot: { vertical: 0.57, horizontal: 0.78 },
};

interface Props {
  renderPuesto: (posicion: Posicion) => ReactNode;
}

export function Cancha({ renderPuesto }: Props) {
  const [ancho, setAncho] = useState(0);
  const alto = (ancho * ALTO_VISTA) / ANCHO_VISTA;

  function medir(evento: LayoutChangeEvent) {
    setAncho(evento.nativeEvent.layout.width);
  }

  const linea = { stroke: colores.lineaCancha, strokeWidth: GROSOR, fill: 'none' };

  return (
    <View style={styles.cancha} onLayout={medir}>
      <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${ANCHO_VISTA} ${ALTO_VISTA}`}>
        <Line x1={0} y1={20} x2={ANCHO_VISTA} y2={20} {...linea} />
        <Circle cx={75} cy={20} r={18} {...linea} />
        <Path d="M 9 160 L 9 130.1 A 67.5 67.5 0 0 1 141 130.1 L 141 160" {...linea} />
        <Rect x={50.5} y={102} width={49} height={58} {...linea} />
        <Circle cx={75} cy={102} r={18} {...linea} />
        <Line x1={66} y1={148} x2={84} y2={148} {...linea} />
        <Circle cx={75} cy={144.25} r={2.25} {...linea} />
      </Svg>

      {ancho > 0
        ? POSICIONES.map((posicion) => (
            <View
              key={posicion}
              style={[
                styles.puesto,
                {
                  top: alto * UBICACION[posicion].vertical,
                  left: ancho * UBICACION[posicion].horizontal - ANCHO_CARTA / 2,
                },
              ]}
            >
              {renderPuesto(posicion)}
            </View>
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cancha: {
    aspectRatio: ANCHO_VISTA / ALTO_VISTA,
    backgroundColor: colores.cancha,
    borderWidth: 1,
    borderColor: colores.lineaCancha,
    borderRadius: radio.md,
    overflow: 'hidden',
  },
  puesto: {
    position: 'absolute',
  },
});
