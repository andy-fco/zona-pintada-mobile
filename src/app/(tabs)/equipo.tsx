import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/api/client';
import { obtenerMiEquipo, obtenerPuntosSemana } from '@/api/equiposFantasy';
import { obtenerSemanaActual } from '@/api/semanas';
import { Banco } from '@/components/Banco';
import { Boton } from '@/components/Boton';
import { Cancha } from '@/components/Cancha';
import { CartaJugador } from '@/components/CartaJugador';
import { EstadoVacio } from '@/components/EstadoVacio';
import { ModalOpciones } from '@/components/ModalOpciones';
import { Pantalla } from '@/components/Pantalla';
import { TituloSeccion } from '@/components/TituloSeccion';
import { NOMBRE_POSICION } from '@/constants/posiciones';
import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import { formatearPuntos, formatearValor } from '@/lib/formato';
import type { EquipoFantasy, IntegrantePuntos, PuntosSemanaEquipo, RolPlantel } from '@/types/equipoFantasy';
import type { Posicion } from '@/types/jugador';

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'sinEquipo' }
  | { tipo: 'listo'; equipo: EquipoFantasy; puntos: PuntosSemanaEquipo | null };

interface Detalle {
  titulo: string;
  mensaje: string;
}

const NOMBRE_ROL: Record<RolPlantel, string> = {
  capitan: 'Capitán',
  sexto_hombre: 'Sexto hombre',
  normal: '',
};

function describirPartidos(puntos: IntegrantePuntos | null | undefined, semanaCargada: boolean) {
  if (!semanaCargada) {
    return 'No hay una semana en curso.';
  }
  if (!puntos || puntos.partidos.length === 0) {
    return 'Todavía no jugó esta semana.';
  }
  return puntos.partidos
    .map(
      (partido) =>
        `vs ${partido.rival}: ${formatearPuntos(partido.puntosFantasy)} pts → ${formatearPuntos(partido.puntosAportados)} para tu equipo`,
    )
    .join('\n');
}

export default function Equipo() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' });
  const [detalle, setDetalle] = useState<Detalle | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function cargar() {
        try {
          const equipo = await obtenerMiEquipo();
          let puntos: PuntosSemanaEquipo | null = null;
          try {
            const semana = await obtenerSemanaActual();
            puntos = await obtenerPuntosSemana(semana.id);
          } catch {
            puntos = null;
          }
          setEstado({ tipo: 'listo', equipo, puntos });
        } catch (e) {
          if (e instanceof ApiError && e.status === 404) {
            setEstado({ tipo: 'sinEquipo' });
          } else {
            setEstado({
              tipo: 'error',
              mensaje: e instanceof ApiError ? e.message : 'No se pudo cargar tu equipo.',
            });
          }
        }
      }
      cargar();
    }, []),
  );

  if (estado.tipo === 'cargando') {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator color={colores.naranja} size="large" />
      </View>
    );
  }

  if (estado.tipo === 'error') {
    return (
      <Pantalla>
        <TituloSeccion etiqueta="Temporada regular" titulo="Mi equipo" />
        <EstadoVacio icono="cloud-offline-outline" mensaje={estado.mensaje} />
      </Pantalla>
    );
  }

  if (estado.tipo === 'sinEquipo') {
    return (
      <Pantalla>
        <TituloSeccion etiqueta="Temporada regular" titulo="Mi equipo" />
        <EstadoVacio
          icono="basketball-outline"
          mensaje="Todavía no armaste tu equipo. Elegí 10 jugadores y un DT con un presupuesto de $110M."
        />
        <Boton titulo="Crear equipo" onPress={() => router.push('/crear-equipo')} />
      </Pantalla>
    );
  }

  const { equipo, puntos } = estado;
  const semanaCargada = puntos !== null;
  const puntosPorJugador = new Map(puntos?.jugadores.map((integrante) => [integrante.id, integrante]) ?? []);

  function renderCarta(posicion: Posicion, titular: boolean) {
    const jugador = equipo.jugadores.find((item) => item.posicion === posicion && item.titular === titular);
    if (!jugador) {
      return null;
    }
    const puntosJugador = puntosPorJugador.get(jugador.id);
    const rol = NOMBRE_ROL[jugador.rol] || (titular ? 'Titular' : 'Suplente');

    return (
      <CartaJugador
        etiqueta={NOMBRE_POSICION[posicion]}
        nombre={jugador.apellido}
        dato={`${formatearPuntos(puntosJugador?.puntosSemana ?? 0)} PTS`}
        insignia={jugador.rol === 'capitan' ? 'C' : jugador.rol === 'sexto_hombre' ? '6º' : null}
        style={titular ? undefined : styles.cartaBanco}
        onPress={() =>
          setDetalle({
            titulo: `${jugador.nombre} ${jugador.apellido}`,
            mensaje: [
              `${jugador.equipoNombre} · ${rol} x${jugador.multiplicador} · ${formatearValor(jugador.valor)}`,
              `Puntos de la semana: ${formatearPuntos(puntosJugador?.puntosSemana ?? 0)}`,
              describirPartidos(puntosJugador, semanaCargada),
            ].join('\n\n'),
          })
        }
      />
    );
  }

  return (
    <>
      <Pantalla>
        <TituloSeccion etiqueta={equipo.temporadaNombre} titulo={equipo.nombre} />

        <View style={styles.resumen}>
          <Dato
            etiqueta={puntos ? `Semana ${puntos.numeroSemana}` : 'Semana'}
            valor={String(puntos?.puntosEquipo ?? equipo.puntosSemana)}
            destacado
          />
          <Dato etiqueta="Totales" valor={String(equipo.puntosTotales)} />
          <Dato etiqueta="Disponible" valor={formatearValor(equipo.presupuestoRestante)} />
        </View>

        <Cancha renderPuesto={(posicion) => renderCarta(posicion, true)} />

        <Banco
          dt={
            <CartaJugador
              etiqueta="DT"
              nombre={equipo.dt.apellido}
              dato={`${formatearPuntos(puntos?.dt?.puntosSemana ?? 0)} PTS`}
              onPress={() =>
                setDetalle({
                  titulo: `${equipo.dt.nombre} ${equipo.dt.apellido}`,
                  mensaje: [
                    `${equipo.dt.equipoNombre} · ${formatearValor(equipo.dt.valor)}`,
                    `Puntos de la semana: ${formatearPuntos(puntos?.dt?.puntosSemana ?? 0)}`,
                    describirPartidos(puntos?.dt, semanaCargada),
                  ].join('\n\n'),
                })
              }
            />
          }
          descripcionDt={`${equipo.dt.nombre} ${equipo.dt.apellido} · ${equipo.dt.equipoNombre}`}
          renderSuplente={(posicion) => renderCarta(posicion, false)}
        />
      </Pantalla>

      {detalle ? (
        <ModalOpciones
          titulo={detalle.titulo}
          mensaje={detalle.mensaje}
          opciones={[]}
          textoCerrar="Cerrar"
          onCerrar={() => setDetalle(null)}
        />
      ) : null}
    </>
  );
}

function Dato({ etiqueta, valor, destacado = false }: { etiqueta: string; valor: string; destacado?: boolean }) {
  return (
    <View style={styles.dato}>
      <Text style={styles.datoEtiqueta}>{etiqueta}</Text>
      <Text style={[styles.datoValor, destacado && styles.datoDestacado]}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.fondo,
  },
  cartaBanco: {
    width: '100%',
  },
  resumen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
  },
  dato: {
    gap: 2,
  },
  datoEtiqueta: {
    fontFamily: fuentes.texto,
    fontSize: 11,
    color: colores.textoSecundario,
  },
  datoValor: {
    fontFamily: fuentes.numeros,
    fontSize: 22,
    fontWeight: '700',
    color: colores.texto,
  },
  datoDestacado: {
    color: colores.naranja,
  },
});
