import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ApiError } from '@/api/client';
import { obtenerEquipo, obtenerPuntosSemanaDeEquipo } from '@/api/equiposFantasy';
import { obtenerSemanaActual } from '@/api/semanas';
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
  | { tipo: 'listo'; equipo: EquipoFantasy; puntos: PuntosSemanaEquipo | null };

async function buscarPuntos(equipoId: number, semanaId: number | null) {
  try {
    const id = semanaId ?? (await obtenerSemanaActual()).id;
    return await obtenerPuntosSemanaDeEquipo(equipoId, id);
  } catch {
    return null;
  }
}

export default function EquipoRival() {
  const parametros = useLocalSearchParams<{ id: string; semanaId?: string }>();
  const equipoId = Number(parametros.id);
  const semanaId = parametros.semanaId ? Number(parametros.semanaId) : null;
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' });

  useEffect(() => {
    async function cargar() {
      try {
        const [equipo, puntos] = await Promise.all([obtenerEquipo(equipoId), buscarPuntos(equipoId, semanaId)]);
        setEstado({ tipo: 'listo', equipo, puntos });
      } catch (e) {
        setEstado({
          tipo: 'error',
          mensaje: e instanceof ApiError ? e.message : 'No se pudo cargar el equipo.',
        });
      }
    }
    cargar();
  }, [equipoId, semanaId]);

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
        <EstadoVacio icono="cloud-offline-outline" mensaje={estado.mensaje} />
      </Pantalla>
    );
  }

  const { equipo, puntos } = estado;

  return (
    <Pantalla>
      <TituloSeccion etiqueta={`@${equipo.usuario}`} titulo={equipo.nombre} />

      <ResumenEquipo
        datos={[
          {
            etiqueta: puntos ? `Semana ${puntos.numeroSemana}` : 'Semana',
            valor: String(puntos?.puntosEquipo ?? 0),
            destacado: true,
          },
          { etiqueta: 'Totales', valor: String(equipo.puntosTotales) },
          { etiqueta: 'Valor', valor: formatearValor(equipo.presupuestoUtilizado) },
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
