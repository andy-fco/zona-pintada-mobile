import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/api/client';
import { obtenerDestacados } from '@/api/liga';
import { Cancha } from '@/components/Cancha';
import { CartaJugador } from '@/components/CartaJugador';
import { EstadoVacio } from '@/components/EstadoVacio';
import { ModalOpciones } from '@/components/ModalOpciones';
import { NOMBRE_POSICION, SIGLA_POSICION } from '@/constants/posiciones';
import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import { formatearPuntos } from '@/lib/formato';
import type { DestacadosSemana as Destacados, JugadorDestacado } from '@/types/liga';

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'listo'; destacados: Destacados };

function describirPartidos(cantidad: number) {
  return cantidad === 1 ? '1 partido' : `${cantidad} partidos`;
}

export function DestacadosSemana({ semanaId }: { semanaId: number }) {
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' });
  const [elegido, setElegido] = useState<JugadorDestacado | null>(null);

  useFocusEffect(
    useCallback(() => {
      let vigente = true;

      async function cargar() {
        setEstado({ tipo: 'cargando' });
        try {
          const destacados = await obtenerDestacados(semanaId);
          if (vigente) {
            setEstado({ tipo: 'listo', destacados });
          }
        } catch (e) {
          if (vigente) {
            setEstado({
              tipo: 'error',
              mensaje: e instanceof ApiError ? e.message : 'No se pudieron cargar los destacados.',
            });
          }
        }
      }

      cargar();
      return () => {
        vigente = false;
      };
    }, [semanaId]),
  );

  if (estado.tipo === 'cargando') {
    return <ActivityIndicator color={colores.naranja} style={styles.cargando} />;
  }

  if (estado.tipo === 'error') {
    return <EstadoVacio icono="cloud-offline-outline" mensaje={estado.mensaje} />;
  }

  const { mvp, quintetoIdeal, lideres } = estado.destacados;

  if (!mvp) {
    return <EstadoVacio icono="stats-chart-outline" mensaje="Todavía no hay estadísticas en esta semana." />;
  }

  return (
    <>
      <View style={styles.mvp}>
        <View style={styles.mvpDatos}>
          <Text style={styles.etiqueta}>MVP DE LA SEMANA</Text>
          <Text style={styles.mvpNombre} numberOfLines={1} adjustsFontSizeToFit>
            {mvp.nombre} {mvp.apellido}
          </Text>
          <Text style={styles.detalle}>
            {mvp.equipoNombre} · {NOMBRE_POSICION[mvp.posicion]} · {describirPartidos(mvp.partidosJugados)}
          </Text>
        </View>
        <View style={styles.mvpPuntos}>
          <Text style={styles.mvpValor}>{formatearPuntos(mvp.puntosFantasy)}</Text>
          <Text style={styles.etiqueta}>PTS</Text>
        </View>
      </View>

      <Text style={styles.subtitulo}>QUINTETO IDEAL</Text>
      <Cancha
        renderPuesto={(posicion) => {
          const jugador = quintetoIdeal.find((item) => item.posicion === posicion);
          if (!jugador) {
            return null;
          }
          return (
            <CartaJugador
              etiqueta={NOMBRE_POSICION[posicion]}
              nombre={jugador.apellido}
              dato={`${formatearPuntos(jugador.puntosFantasy)} PTS`}
              insignia={jugador.jugadorId === mvp.jugadorId ? 'MVP' : null}
              onPress={() => setElegido(jugador)}
            />
          );
        }}
      />

      <Text style={styles.subtitulo}>LÍDERES DE LA SEMANA</Text>
      <View style={styles.lista}>
        {lideres.map((jugador, indice) => (
          <View key={jugador.jugadorId} style={styles.lider}>
            <Text style={[styles.lugar, indice < 3 && styles.lugarPodio]}>{indice + 1}</Text>
            <View style={styles.liderDatos}>
              <Text style={styles.liderNombre} numberOfLines={1}>
                {jugador.nombre} {jugador.apellido}
              </Text>
              <Text style={styles.detalle} numberOfLines={1}>
                {jugador.equipoNombre} · {SIGLA_POSICION[jugador.posicion]}
              </Text>
            </View>
            <Text style={styles.liderPuntos}>{formatearPuntos(jugador.puntosFantasy)}</Text>
          </View>
        ))}
      </View>

      {elegido ? (
        <ModalOpciones
          titulo={`${elegido.nombre} ${elegido.apellido}`}
          mensaje={[
            `${elegido.equipoNombre} · ${NOMBRE_POSICION[elegido.posicion]}`,
            `${formatearPuntos(elegido.puntosFantasy)} puntos fantasy en ${describirPartidos(elegido.partidosJugados)}`,
          ].join('\n\n')}
          opciones={[]}
          textoCerrar="Cerrar"
          onCerrar={() => setElegido(null)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  cargando: {
    marginTop: espaciado.xl,
  },
  etiqueta: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colores.textoSecundario,
  },
  detalle: {
    fontFamily: fuentes.texto,
    fontSize: 12,
    color: colores.textoSecundario,
  },
  mvp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    padding: espaciado.lg,
    backgroundColor: colores.naranjaSuave,
    borderWidth: 1,
    borderColor: colores.naranja,
    borderRadius: radio.md,
  },
  mvpDatos: {
    flex: 1,
    gap: 2,
  },
  mvpNombre: {
    fontFamily: fuentes.titulo,
    fontSize: 28,
    color: colores.texto,
  },
  mvpPuntos: {
    alignItems: 'center',
  },
  mvpValor: {
    fontFamily: fuentes.titulo,
    fontSize: 36,
    color: colores.naranja,
  },
  subtitulo: {
    fontFamily: fuentes.subtitulo,
    fontSize: 18,
    letterSpacing: 0.5,
    color: colores.texto,
    marginBottom: -espaciado.sm,
  },
  lista: {
    gap: espaciado.sm,
  },
  lider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    padding: espaciado.md,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
  },
  lugar: {
    width: 24,
    textAlign: 'center',
    fontFamily: fuentes.titulo,
    fontSize: 20,
    color: colores.textoSecundario,
  },
  lugarPodio: {
    color: colores.naranja,
  },
  liderDatos: {
    flex: 1,
    gap: 2,
  },
  liderNombre: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 14,
    color: colores.texto,
  },
  liderPuntos: {
    fontFamily: fuentes.numeros,
    fontSize: 16,
    fontWeight: '700',
    color: colores.texto,
  },
});
