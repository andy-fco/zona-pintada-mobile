import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colores, espaciado, fuentes, radio } from '@/constants/theme';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario';
  cargando?: boolean;
  deshabilitado?: boolean;
}

export function Boton({
  titulo,
  onPress,
  variante = 'primario',
  cargando = false,
  deshabilitado = false,
}: Props) {
  const inactivo = cargando || deshabilitado;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      style={({ pressed }) => [
        styles.base,
        variante === 'primario' ? styles.primario : styles.secundario,
        (pressed || inactivo) && styles.atenuado,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={colores.texto} />
      ) : (
        <Text style={styles.texto}>{titulo.toUpperCase()}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radio.sm,
    paddingHorizontal: espaciado.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    backgroundColor: colores.naranja,
  },
  secundario: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  atenuado: {
    opacity: 0.6,
  },
  texto: {
    fontFamily: fuentes.subtitulo,
    fontSize: 18,
    letterSpacing: 0.5,
    color: colores.texto,
  },
});
