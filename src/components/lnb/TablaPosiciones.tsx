import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/api/client';
import { obtenerPosiciones } from '@/api/liga';
import { EstadoVacio } from '@/components/EstadoVacio';
import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import type { PosicionLiga } from '@/types/liga';

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'listo'; tabla: PosicionLiga[] };

const COLUMNAS = ['PJ', 'G', 'P', 'DIF', 'PTS'];

export function TablaPosiciones() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' });

  useFocusEffect(
    useCallback(() => {
      let vigente = true;

      async function cargar() {
        try {
          const tabla = await obtenerPosiciones();
          if (vigente) {
            setEstado({ tipo: 'listo', tabla });
          }
        } catch (e) {
          if (vigente) {
            setEstado({
              tipo: 'error',
              mensaje: e instanceof ApiError ? e.message : 'No se pudo cargar la tabla.',
            });
          }
        }
      }

      cargar();
      return () => {
        vigente = false;
      };
    }, []),
  );

  if (estado.tipo === 'cargando') {
    return <ActivityIndicator color={colores.naranja} style={styles.cargando} />;
  }

  if (estado.tipo === 'error') {
    return <EstadoVacio icono="cloud-offline-outline" mensaje={estado.mensaje} />;
  }

  return (
    <View style={styles.tabla}>
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.textoEncabezado, styles.posicion]}>#</Text>
        <Text style={[styles.textoEncabezado, styles.equipo]}>EQUIPO</Text>
        {COLUMNAS.map((columna) => (
          <Text key={columna} style={[styles.textoEncabezado, columna === 'DIF' ? styles.ancha : styles.numero]}>
            {columna}
          </Text>
        ))}
      </View>

      {estado.tabla.map((fila, indice) => (
        <View key={fila.equipoId} style={[styles.fila, indice < estado.tabla.length - 1 && styles.separador]}>
          <Text style={[styles.texto, styles.posicion]}>{fila.posicion}</Text>
          <Text style={[styles.texto, styles.equipo, styles.nombre]} numberOfLines={1}>
            {fila.nombreCorto ?? fila.equipoNombre}
          </Text>
          <Text style={[styles.texto, styles.numero]}>{fila.partidosJugados}</Text>
          <Text style={[styles.texto, styles.numero]}>{fila.ganados}</Text>
          <Text style={[styles.texto, styles.numero]}>{fila.perdidos}</Text>
          <Text style={[styles.texto, styles.ancha, fila.diferencia > 0 ? styles.positivo : fila.diferencia < 0 ? styles.negativo : null]}>
            {fila.diferencia > 0 ? `+${fila.diferencia}` : fila.diferencia}
          </Text>
          <Text style={[styles.texto, styles.numero, styles.puntos]}>{fila.puntos}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cargando: {
    marginTop: espaciado.xl,
  },
  tabla: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
    overflow: 'hidden',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: espaciado.sm + 2,
    paddingHorizontal: espaciado.md,
    gap: espaciado.xs,
  },
  encabezado: {
    backgroundColor: colores.superficieElevada,
  },
  separador: {
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  textoEncabezado: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colores.textoSecundario,
  },
  texto: {
    fontFamily: fuentes.numeros,
    fontSize: 13,
    color: colores.textoSecundario,
  },
  posicion: {
    width: 22,
    textAlign: 'center',
  },
  equipo: {
    flex: 1,
  },
  nombre: {
    fontFamily: fuentes.textoMedio,
    color: colores.texto,
  },
  numero: {
    width: 26,
    textAlign: 'center',
  },
  ancha: {
    width: 40,
    textAlign: 'center',
  },
  positivo: {
    color: colores.positivo,
  },
  negativo: {
    color: colores.negativo,
  },
  puntos: {
    fontWeight: '700',
    color: colores.naranja,
  },
});
