import { EstadoVacio } from '@/components/EstadoVacio';
import { Pantalla } from '@/components/Pantalla';
import { TituloSeccion } from '@/components/TituloSeccion';

export default function Competencia() {
  return (
    <Pantalla>
      <TituloSeccion etiqueta="Temporada regular" titulo="Ranking nacional" />
      <EstadoVacio icono="stats-chart-outline" mensaje="Acá vas a ver el ranking general y el semanal." />
    </Pantalla>
  );
}
