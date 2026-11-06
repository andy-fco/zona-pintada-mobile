import { EstadoVacio } from '@/components/EstadoVacio';
import { Pantalla } from '@/components/Pantalla';
import { TituloSeccion } from '@/components/TituloSeccion';

export default function Equipo() {
  return (
    <Pantalla>
      <TituloSeccion etiqueta="Temporada regular" titulo="Mi equipo" />
      <EstadoVacio icono="basketball-outline" mensaje="Acá vas a ver tu plantel y los puntos de la semana." />
    </Pantalla>
  );
}
