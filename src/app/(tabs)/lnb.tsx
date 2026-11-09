import { useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { EstadoVacio } from '@/components/EstadoVacio';
import { DestacadosSemana } from '@/components/lnb/DestacadosSemana';
import { PartidosSemana } from '@/components/lnb/PartidosSemana';
import { TablaPosiciones } from '@/components/lnb/TablaPosiciones';
import { Pantalla } from '@/components/Pantalla';
import { Selector } from '@/components/Selector';
import { SelectorSemana } from '@/components/SelectorSemana';
import { TituloSeccion } from '@/components/TituloSeccion';
import { colores, espaciado } from '@/constants/theme';
import { useSemanasDisponibles } from '@/hooks/useSemanasDisponibles';

type Vista = 'tabla' | 'destacados' | 'partidos';

const VISTAS = [
  { valor: 'tabla' as const, texto: 'Tabla' },
  { valor: 'destacados' as const, texto: 'Destacados' },
  { valor: 'partidos' as const, texto: 'Partidos' },
];

export default function Lnb() {
  const [vista, setVista] = useState<Vista>('tabla');
  const semanas = useSemanasDisponibles();

  function renderVistaSemanal() {
    if (semanas.cargando) {
      return <ActivityIndicator color={colores.naranja} style={styles.cargando} />;
    }
    if (!semanas.semana) {
      return <EstadoVacio icono="calendar-outline" mensaje="Todavía no hay semanas para mostrar." />;
    }
    return (
      <>
        <SelectorSemana
          semana={semanas.semana}
          puedeRetroceder={semanas.puedeRetroceder}
          puedeAvanzar={semanas.puedeAvanzar}
          onRetroceder={semanas.retroceder}
          onAvanzar={semanas.avanzar}
        />
        {vista === 'destacados' ? (
          <DestacadosSemana semanaId={semanas.semana.id} />
        ) : (
          <PartidosSemana semanaId={semanas.semana.id} />
        )}
      </>
    );
  }

  return (
    <Pantalla>
      <TituloSeccion etiqueta="Liga Nacional de Básquet" titulo="La Liga" />
      <Selector opciones={VISTAS} seleccionado={vista} onCambiar={setVista} />
      {vista === 'tabla' ? <TablaPosiciones /> : renderVistaSemanal()}
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  cargando: {
    marginTop: espaciado.xl,
  },
});
