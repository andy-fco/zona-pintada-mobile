import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/api/client';
import { listarPartidos } from '@/api/liga';
import { EstadoVacio } from '@/components/EstadoVacio';
import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import { formatearDiaSemana } from '@/lib/formato';
import type { Partido } from '@/types/liga';

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'listo'; partidos: Partido[] };

function agruparPorDia(partidos: Partido[]) {
  const dias = new Map<string, Partido[]>();
  for (const partido of partidos) {
    const lista = dias.get(partido.fecha) ?? [];
    lista.push(partido);
    dias.set(partido.fecha, lista);
  }
  return [...dias.entries()];
}

export function PartidosSemana({ semanaId }: { semanaId: number }) {
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' });

  useFocusEffect(
    useCallback(() => {
      let vigente = true;

      async function cargar() {
        setEstado({ tipo: 'cargando' });
        try {
          const partidos = await listarPartidos(semanaId);
          if (vigente) {
            setEstado({ tipo: 'listo', partidos });
          }
        } catch (e) {
          if (vigente) {
            setEstado({
              tipo: 'error',
              mensaje: e instanceof ApiError ? e.message : 'No se pudieron cargar los partidos.',
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

  if (estado.partidos.length === 0) {
    return <EstadoVacio icono="calendar-outline" mensaje="No hay partidos cargados en esta semana." />;
  }

  return (
    <>
      {agruparPorDia(estado.partidos).map(([fecha, partidos]) => (
        <View key={fecha} style={styles.dia}>
          <Text style={styles.diaTitulo}>{formatearDiaSemana(fecha).toUpperCase()}</Text>
          {partidos.map((partido) => (
            <TarjetaPartido key={partido.id} partido={partido} />
          ))}
        </View>
      ))}
    </>
  );
}

function TarjetaPartido({ partido }: { partido: Partido }) {
  const finalizado = partido.estado === 'finalizado';
  const ganaLocal = finalizado && (partido.puntosLocal ?? 0) > (partido.puntosVisitante ?? 0);
  const ganaVisitante = finalizado && (partido.puntosVisitante ?? 0) > (partido.puntosLocal ?? 0);

  return (
    <View style={styles.tarjeta}>
      <View style={styles.equipos}>
        <FilaEquipo nombre={partido.equipoLocal} puntos={partido.puntosLocal} ganador={ganaLocal} />
        <FilaEquipo nombre={partido.equipoVisitante} puntos={partido.puntosVisitante} ganador={ganaVisitante} />
      </View>
      <View style={styles.estado}>
        <EstadoPartido partido={partido} />
      </View>
    </View>
  );
}

function FilaEquipo({ nombre, puntos, ganador }: { nombre: string; puntos: number | null; ganador: boolean }) {
  return (
    <View style={styles.filaEquipo}>
      <Text style={[styles.nombreEquipo, ganador && styles.ganador]} numberOfLines={1}>
        {nombre}
      </Text>
      <Text style={[styles.puntos, ganador && styles.ganador]}>{puntos ?? '-'}</Text>
    </View>
  );
}

function EstadoPartido({ partido }: { partido: Partido }) {
  if (partido.estado === 'finalizado') {
    return <Text style={styles.textoEstado}>FINAL</Text>;
  }
  if (partido.estado === 'en_juego') {
    return <Text style={[styles.textoEstado, styles.enJuego]}>EN JUEGO</Text>;
  }
  if (partido.estado === 'suspendido') {
    return <Text style={[styles.textoEstado, styles.suspendido]}>SUSP.</Text>;
  }
  return <Text style={styles.hora}>{partido.hora.slice(0, 5)}</Text>;
}

const styles = StyleSheet.create({
  cargando: {
    marginTop: espaciado.xl,
  },
  dia: {
    gap: espaciado.sm,
  },
  diaTitulo: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colores.textoSecundario,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: espaciado.md,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
  },
  equipos: {
    flex: 1,
    gap: espaciado.sm,
    paddingRight: espaciado.md,
    borderRightWidth: 1,
    borderRightColor: colores.borde,
  },
  filaEquipo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
  },
  nombreEquipo: {
    flex: 1,
    fontFamily: fuentes.textoMedio,
    fontSize: 14,
    color: colores.textoSecundario,
  },
  puntos: {
    fontFamily: fuentes.numeros,
    fontSize: 16,
    fontWeight: '700',
    color: colores.textoSecundario,
  },
  ganador: {
    color: colores.texto,
  },
  estado: {
    width: 72,
    alignItems: 'center',
  },
  textoEstado: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colores.textoSecundario,
  },
  enJuego: {
    color: colores.naranja,
  },
  suspendido: {
    color: colores.negativo,
  },
  hora: {
    fontFamily: fuentes.numeros,
    fontSize: 15,
    fontWeight: '700',
    color: colores.texto,
  },
});
