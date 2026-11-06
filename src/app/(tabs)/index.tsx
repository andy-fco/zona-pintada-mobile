import { StyleSheet, Text, View } from 'react-native';

import { EstadoVacio } from '@/components/EstadoVacio';
import { Pantalla } from '@/components/Pantalla';
import { colores, fuentes } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function Inicio() {
  const { usuario } = useAuth();

  return (
    <Pantalla>
      <View>
        <Text style={styles.saludo}>Bienvenido,</Text>
        <Text style={styles.nombre}>
          {`${usuario?.nombre ?? ''} ${usuario?.apellido ?? ''}`.toUpperCase()}
        </Text>
      </View>
      <EstadoVacio icono="newspaper-outline" mensaje="Acá vas a ver el resumen de tu equipo y de la semana." />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  saludo: {
    fontFamily: fuentes.texto,
    fontSize: 13,
    color: colores.textoSecundario,
  },
  nombre: {
    fontFamily: fuentes.titulo,
    fontSize: 32,
    color: colores.texto,
  },
});
