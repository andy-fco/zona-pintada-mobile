import { useEffect, useState } from 'react';

import { listarSemanas, obtenerSemanaActual } from '@/api/semanas';
import type { Semana } from '@/types/semana';

export function useSemanasDisponibles() {
  const [semanas, setSemanas] = useState<Semana[] | null>(null);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    async function cargar() {
      try {
        const [todas, actual] = await Promise.all([listarSemanas(), obtenerSemanaActual().catch(() => null)]);
        const disponibles = todas.filter(
          (item) => item.cerradaAt !== null || (actual !== null && item.numeroSemana <= actual.numeroSemana),
        );
        setSemanas(disponibles);
        setIndice(Math.max(disponibles.length - 1, 0));
      } catch {
        setSemanas([]);
      }
    }
    cargar();
  }, []);

  const cantidad = semanas?.length ?? 0;

  return {
    cargando: semanas === null,
    semana: cantidad > 0 && semanas ? semanas[indice] : null,
    puedeRetroceder: indice > 0,
    puedeAvanzar: indice < cantidad - 1,
    retroceder: () => setIndice((actual) => Math.max(actual - 1, 0)),
    avanzar: () => setIndice((actual) => Math.min(actual + 1, cantidad - 1)),
  };
}
