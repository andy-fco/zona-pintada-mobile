import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colores, espaciado, fuentes, radio } from '@/constants/theme';

interface Props extends TextInputProps {
  etiqueta: string;
  error?: string;
}

export function Campo({ etiqueta, error, style, ...props }: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        placeholderTextColor={colores.textoTenue}
        autoCapitalize={props.secureTextEntry ? 'none' : props.autoCapitalize}
        autoCorrect={props.secureTextEntry ? false : props.autoCorrect}
        style={[styles.input, error ? styles.inputConError : null, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: espaciado.xs,
  },
  etiqueta: {
    fontFamily: fuentes.textoMedio,
    fontSize: 12,
    color: colores.textoSecundario,
  },
  input: {
    minHeight: 48,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.sm,
    paddingHorizontal: espaciado.md,
    fontFamily: fuentes.texto,
    fontSize: 15,
    color: colores.texto,
  },
  inputConError: {
    borderColor: colores.negativo,
  },
  error: {
    fontFamily: fuentes.texto,
    fontSize: 12,
    color: colores.negativo,
  },
});
