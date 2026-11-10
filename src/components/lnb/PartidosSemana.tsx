import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ApiError } from '@/api/client';
import { listarPartidos } from '@/api/liga';
import { EstadoVacio } from '@/components/EstadoVacio';
import { ListaPartidos } from '@/components/ListaPartidos';
import { colores, espaciado } from '@/constants/theme';
import type { Partido } from '@/types/liga';

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'listo'; partidos: Partido[] };

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

  return <ListaPartidos partidos={estado.partidos} />;
}

const styles = StyleSheet.create({
  cargando: {
    marginTop: espaciado.xl,
  },
});
