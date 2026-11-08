import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Banco } from '@/components/Banco';
import { Cancha } from '@/components/Cancha';
import { CartaJugador } from '@/components/CartaJugador';
import { ModalOpciones } from '@/components/ModalOpciones';
import { NOMBRE_POSICION } from '@/constants/posiciones';
import { formatearPuntos, formatearValor } from '@/lib/formato';
import type { EquipoFantasy, IntegrantePuntos, PuntosSemanaEquipo, RolPlantel } from '@/types/equipoFantasy';
import type { Posicion } from '@/types/jugador';

interface Detalle {
  titulo: string;
  mensaje: string;
}

interface Props {
  equipo: EquipoFantasy;
  puntos: PuntosSemanaEquipo | null;
}

const NOMBRE_ROL: Record<RolPlantel, string> = {
  capitan: 'Capitán',
  sexto_hombre: 'Sexto hombre',
  normal: '',
};

function describirPartidos(integrante: IntegrantePuntos | null | undefined, puntos: PuntosSemanaEquipo | null) {
  if (!puntos) {
    return 'No hay una semana en curso.';
  }
  if (!integrante || integrante.partidos.length === 0) {
    return puntos.cerrada ? 'No jugó en esta semana.' : 'Todavía no jugó esta semana.';
  }
  return integrante.partidos
    .map(
      (partido) =>
        `vs ${partido.rival}: ${formatearPuntos(partido.puntosFantasy)} pts → ${formatearPuntos(partido.puntosAportados)} para el equipo`,
    )
    .join('\n');
}

export function PlantelEquipo({ equipo, puntos }: Props) {
  const [detalle, setDetalle] = useState<Detalle | null>(null);
  const puntosPorJugador = new Map(puntos?.jugadores.map((integrante) => [integrante.id, integrante]) ?? []);
  const etiquetaPuntos = puntos ? `Puntos de la semana ${puntos.numeroSemana}` : 'Puntos de la semana';

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
              `${etiquetaPuntos}: ${formatearPuntos(puntosJugador?.puntosSemana ?? 0)}`,
              describirPartidos(puntosJugador, puntos),
            ].join('\n\n'),
          })
        }
      />
    );
  }

  return (
    <>
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
                  `${etiquetaPuntos}: ${formatearPuntos(puntos?.dt?.puntosSemana ?? 0)}`,
                  describirPartidos(puntos?.dt, puntos),
                ].join('\n\n'),
              })
            }
          />
        }
        descripcionDt={`${equipo.dt.nombre} ${equipo.dt.apellido} · ${equipo.dt.equipoNombre}`}
        renderSuplente={(posicion) => renderCarta(posicion, false)}
      />

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

const styles = StyleSheet.create({
  cartaBanco: {
    width: '100%',
  },
});
