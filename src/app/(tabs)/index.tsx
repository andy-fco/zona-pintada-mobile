import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/api/client';
import { obtenerMiEquipo, obtenerPuntosSemana } from '@/api/equiposFantasy';
import { listarPartidos, obtenerDestacados } from '@/api/liga';
import { obtenerRankingGeneral, obtenerRankingSemanal } from '@/api/rankings';
import { listarSemanas, obtenerSemanaActual } from '@/api/semanas';
import { Boton } from '@/components/Boton';
import { EstadoVacio } from '@/components/EstadoVacio';
import { ListaPartidos } from '@/components/ListaPartidos';
import { Pantalla } from '@/components/Pantalla';
import { ResumenEquipo } from '@/components/ResumenEquipo';
import { TarjetaDestacado } from '@/components/TarjetaDestacado';
import { TituloSeccion } from '@/components/TituloSeccion';
import { NOMBRE_POSICION } from '@/constants/posiciones';
import { colores, espaciado, fuentes } from '@/constants/theme';
import { fechaLocalIso, formatearDiaMes, formatearPuntos } from '@/lib/formato';
import type { EquipoFantasy, IntegrantePuntos, PuntosSemanaEquipo } from '@/types/equipoFantasy';
import type { DestacadosSemana, Partido } from '@/types/liga';
import type { Ranking } from '@/types/ranking';
import type { Semana } from '@/types/semana';

interface DatosInicio {
  equipo: EquipoFantasy | null;
  semana: Semana | null;
  puntos: PuntosSemanaEquipo | null;
  rankingGeneral: Ranking | null;
  rankingSemanal: Ranking | null;
  destacadosAnteriores: DestacadosSemana | null;
  partidos: Partido[];
}

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'listo'; datos: DatosInicio };

function opcional<T>(promesa: Promise<T>) {
  return promesa.catch(() => null);
}

function buscarMiEquipo() {
  return obtenerMiEquipo().catch((e) => {
    if (e instanceof ApiError && e.status === 404) {
      return null;
    }
    throw e;
  });
}

function ultimaSemanaCerrada(semanas: Semana[]) {
  return semanas
    .filter((semana) => semana.cerradaAt !== null)
    .reduce<Semana | null>(
      (ultima, semana) => (!ultima || semana.numeroSemana > ultima.numeroSemana ? semana : ultima),
      null,
    );
}

function hoyYManana() {
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);
  return { hoy: fechaLocalIso(hoy), manana: fechaLocalIso(manana) };
}

function elegirProximos(partidos: Partido[]) {
  const { hoy, manana } = hoyYManana();
  const restantes = partidos.filter((partido) => partido.fecha >= hoy);
  const cercanos = restantes.filter((partido) => partido.fecha === hoy || partido.fecha === manana);
  if (cercanos.length > 0) {
    return cercanos;
  }
  const siguienteDia = restantes[0]?.fecha;
  return restantes.filter((partido) => partido.fecha === siguienteDia);
}

function buscarFigura(puntos: PuntosSemanaEquipo | null) {
  return (puntos?.jugadores ?? []).reduce<IntegrantePuntos | null>(
    (mejor, jugador) =>
      jugador.puntosSemana > 0 && (!mejor || jugador.puntosSemana > mejor.puntosSemana) ? jugador : mejor,
    null,
  );
}

async function cargarInicio(): Promise<DatosInicio> {
  const [equipo, semana, semanas, rankingGeneral] = await Promise.all([
    buscarMiEquipo(),
    opcional(obtenerSemanaActual()),
    opcional(listarSemanas()),
    opcional(obtenerRankingGeneral(1)),
  ]);

  const anterior = ultimaSemanaCerrada(semanas ?? []);

  const [puntos, rankingSemanal, destacadosAnteriores, partidos] = await Promise.all([
    semana && equipo ? opcional(obtenerPuntosSemana(semana.id)) : null,
    semana ? opcional(obtenerRankingSemanal(semana.id, 1)) : null,
    anterior ? opcional(obtenerDestacados(anterior.id)) : null,
    semana ? opcional(listarPartidos(semana.id)) : null,
  ]);

  return {
    equipo,
    semana,
    puntos,
    rankingGeneral,
    rankingSemanal,
    destacadosAnteriores,
    partidos: elegirProximos(partidos ?? []),
  };
}

export default function Inicio() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' });

  useFocusEffect(
    useCallback(() => {
      let vigente = true;

      async function cargar() {
        try {
          const datos = await cargarInicio();
          if (vigente) {
            setEstado({ tipo: 'listo', datos });
          }
        } catch (e) {
          if (vigente) {
            setEstado({
              tipo: 'error',
              mensaje: e instanceof ApiError ? e.message : 'No se pudo cargar el inicio.',
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

  const semana = estado.tipo === 'listo' ? estado.datos.semana : null;

  return (
    <Pantalla>
      {semana ? (
        <TituloSeccion
          etiqueta={`${formatearDiaMes(semana.fechaInicio)} al ${formatearDiaMes(semana.fechaFin)}`}
          titulo={`Semana ${semana.numeroSemana}`}
        />
      ) : (
        <TituloSeccion etiqueta="Temporada regular" titulo="Inicio" />
      )}

      {estado.tipo === 'cargando' ? <ActivityIndicator color={colores.naranja} style={styles.cargando} /> : null}
      {estado.tipo === 'error' ? <EstadoVacio icono="cloud-offline-outline" mensaje={estado.mensaje} /> : null}
      {estado.tipo === 'listo' ? <Contenido datos={estado.datos} /> : null}
    </Pantalla>
  );
}

function Contenido({ datos }: { datos: DatosInicio }) {
  const { equipo, semana, puntos, rankingGeneral, rankingSemanal, destacadosAnteriores, partidos } = datos;
  const figura = buscarFigura(puntos);
  const mvpAnterior = destacadosAnteriores?.mvp ?? null;

  return (
    <>
      {equipo ? (
        <Pressable
          style={({ pressed }) => [styles.bloque, pressed && styles.presionado]}
          onPress={() => router.navigate('/equipo')}
        >
          <TituloBloque titulo="Tu equipo" />
          <Text style={styles.nombreEquipo} numberOfLines={1}>
            {equipo.nombre}
          </Text>
          <ResumenEquipo
            datos={[
              {
                etiqueta: puntos ? `Semana ${puntos.numeroSemana}` : 'Semana',
                valor: String(puntos?.puntosEquipo ?? equipo.puntosSemana),
                destacado: true,
              },
              { etiqueta: 'Totales', valor: String(equipo.puntosTotales) },
              { etiqueta: 'Pos. semanal', valor: formatearPosicion(rankingSemanal) },
              { etiqueta: 'Pos. general', valor: formatearPosicion(rankingGeneral) },
            ]}
          />
        </Pressable>
      ) : (
        <View style={styles.bloque}>
          <EstadoVacio
            icono="basketball-outline"
            mensaje="Todavía no armaste tu equipo. Elegí 10 jugadores y un DT con un presupuesto de $110M."
          />
          <Boton titulo="Crear equipo" onPress={() => router.push('/crear-equipo')} />
        </View>
      )}

      {equipo && semana ? (
        figura ? (
          <TarjetaDestacado
            etiqueta="Tu MVP de la semana"
            nombre={`${figura.nombre} ${figura.apellido}`}
            detalle={[figura.equipoNombre, figura.posicion ? NOMBRE_POSICION[figura.posicion] : null]
              .filter(Boolean)
              .join(' · ')}
            puntos={formatearPuntos(figura.puntosSemana)}
            onPress={() => router.navigate('/equipo')}
          />
        ) : (
          <EstadoVacio icono="time-outline" mensaje="Todavía no sumó puntos ningún jugador de tu equipo esta semana." />
        )
      ) : null}

      {mvpAnterior && destacadosAnteriores ? (
        <TarjetaDestacado
          etiqueta={`MVP de la semana ${destacadosAnteriores.numeroSemana}`}
          nombre={`${mvpAnterior.nombre} ${mvpAnterior.apellido}`}
          detalle={`${mvpAnterior.equipoNombre} · ${NOMBRE_POSICION[mvpAnterior.posicion]}`}
          puntos={formatearPuntos(mvpAnterior.puntosFantasy)}
          onPress={() => router.navigate('/lnb')}
        />
      ) : null}

      <View style={styles.bloque}>
        <Pressable style={styles.filaTitulo} onPress={() => router.navigate('/lnb')} hitSlop={8}>
          <TituloBloque titulo="Próximos partidos" />
          <Text style={styles.verTodos}>Ver todos</Text>
        </Pressable>
        {partidos.length > 0 ? (
          <ListaPartidos partidos={partidos} />
        ) : (
          <EstadoVacio icono="calendar-outline" mensaje="No hay más partidos programados para esta semana." />
        )}
      </View>
    </>
  );
}

function TituloBloque({ titulo }: { titulo: string }) {
  return (
    <View style={styles.encabezado}>
      <Text style={styles.titulo}>{titulo.toUpperCase()}</Text>
      <Ionicons name="chevron-forward" size={16} color={colores.textoTenue} />
    </View>
  );
}

function formatearPosicion(ranking: Ranking | null) {
  return ranking?.miPosicion ? `#${ranking.miPosicion.posicion}` : '-';
}

const styles = StyleSheet.create({
  cargando: {
    marginTop: espaciado.xl,
  },
  bloque: {
    gap: espaciado.sm,
  },
  presionado: {
    opacity: 0.7,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.xs,
  },
  titulo: {
    fontFamily: fuentes.subtitulo,
    fontSize: 18,
    letterSpacing: 0.5,
    color: colores.texto,
  },
  nombreEquipo: {
    fontFamily: fuentes.textoMedio,
    fontSize: 14,
    color: colores.textoSecundario,
  },
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verTodos: {
    fontFamily: fuentes.textoMedio,
    fontSize: 13,
    color: colores.naranja,
  },
});
