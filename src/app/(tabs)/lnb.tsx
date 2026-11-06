import { EstadoVacio } from '@/components/EstadoVacio';
import { Pantalla } from '@/components/Pantalla';
import { TituloSeccion } from '@/components/TituloSeccion';

export default function Lnb() {
  return (
    <Pantalla>
      <TituloSeccion etiqueta="Liga Nacional de Básquet" titulo="La Liga" />
      <EstadoVacio icono="trophy-outline" mensaje="Acá vas a ver la tabla, los líderes y los partidos." />
    </Pantalla>
  );
}
