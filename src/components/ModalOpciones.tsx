import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { colores, espaciado, fuentes, radio } from '@/constants/theme';

export interface Opcion {
  texto: string;
  variante?: 'primario' | 'secundario' | 'peligro';
  onPress: () => void;
}

interface Props {
  titulo: string;
  mensaje?: string;
  opciones: Opcion[];
  textoCerrar?: string;
  onCerrar: () => void;
}

export function ModalOpciones({ titulo, mensaje, opciones, textoCerrar = 'Cancelar', onCerrar }: Props) {
  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onCerrar}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <Pressable style={styles.fondo} onPress={onCerrar}>
        <Pressable style={styles.hoja} onPress={() => {}}>
          <View style={styles.manija} />
          <Text style={styles.titulo}>{titulo.toUpperCase()}</Text>
          {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
          <View style={styles.opciones}>
            {opciones.map((opcion) => (
              <Boton
                key={opcion.texto}
                titulo={opcion.texto}
                variante={opcion.variante ?? 'primario'}
                onPress={opcion.onPress}
              />
            ))}
            <Boton titulo={textoCerrar} variante="secundario" onPress={onCerrar} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  hoja: {
    gap: espaciado.md,
    padding: espaciado.xl,
    paddingBottom: espaciado.xxl + espaciado.lg,
    backgroundColor: colores.superficie,
    borderTopLeftRadius: radio.lg,
    borderTopRightRadius: radio.lg,
    borderTopWidth: 1,
    borderColor: colores.borde,
  },
  manija: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colores.borde,
  },
  titulo: {
    fontFamily: fuentes.titulo,
    fontSize: 26,
    color: colores.texto,
  },
  mensaje: {
    fontFamily: fuentes.texto,
    fontSize: 14,
    lineHeight: 21,
    color: colores.textoSecundario,
  },
  opciones: {
    gap: espaciado.sm,
    marginTop: espaciado.sm,
  },
});
