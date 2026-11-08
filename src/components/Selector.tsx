import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, fuentes, radio } from '@/constants/theme';

interface Opcion<T extends string> {
  valor: T;
  texto: string;
}

interface Props<T extends string> {
  opciones: Opcion<T>[];
  seleccionado: T;
  onCambiar: (valor: T) => void;
}

export function Selector<T extends string>({ opciones, seleccionado, onCambiar }: Props<T>) {
  return (
    <View style={styles.contenedor}>
      {opciones.map((opcion) => {
        const activa = opcion.valor === seleccionado;
        return (
          <Pressable
            key={opcion.valor}
            style={[styles.opcion, activa && styles.activa]}
            onPress={() => onCambiar(opcion.valor)}
          >
            <Text style={[styles.texto, activa && styles.textoActivo]}>{opcion.texto.toUpperCase()}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    padding: espaciado.xs,
    gap: espaciado.xs,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
  },
  opcion: {
    flex: 1,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radio.sm,
  },
  activa: {
    backgroundColor: colores.naranja,
  },
  texto: {
    fontFamily: fuentes.subtitulo,
    fontSize: 16,
    letterSpacing: 0.5,
    color: colores.textoSecundario,
  },
  textoActivo: {
    color: colores.texto,
  },
});
