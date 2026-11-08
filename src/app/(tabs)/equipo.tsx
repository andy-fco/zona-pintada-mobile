import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ApiError } from '@/api/client';
import { obtenerMiEquipo, obtenerPuntosSemana } from '@/api/equiposFantasy';
import { obtenerSemanaActual } from '@/api/semanas';
import { Boton } from '@/components/Boton';
import { EstadoVacio } from '@/components/EstadoVacio';
import { Pantalla } from '@/components/Pantalla';
import { PlantelEquipo } from '@/components/PlantelEquipo';
import { ResumenEquipo } from '@/components/ResumenEquipo';
import { TituloSeccion } from '@/components/TituloSeccion';
import { colores } from '@/constants/theme';
import { formatearValor } from '@/lib/formato';
import type { EquipoFantasy, PuntosSemanaEquipo } from '@/types/equipoFantasy';

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'sinEquipo' }
  | { tipo: 'listo'; equipo: EquipoFantasy; puntos: PuntosSemanaEquipo | null };

export default function Equipo() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' });

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

  return (
    <Pantalla>
      <TituloSeccion etiqueta={equipo.temporadaNombre} titulo={equipo.nombre} />

      <ResumenEquipo
        datos={[
          {
            etiqueta: puntos ? `Semana ${puntos.numeroSemana}` : 'Semana',
            valor: String(puntos?.puntosEquipo ?? equipo.puntosSemana),
            destacado: true,
          },
          { etiqueta: 'Totales', valor: String(equipo.puntosTotales) },
          { etiqueta: 'Disponible', valor: formatearValor(equipo.presupuestoRestante) },
        ]}
      />

      <PlantelEquipo equipo={equipo} puntos={puntos} />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.fondo,
  },
});
