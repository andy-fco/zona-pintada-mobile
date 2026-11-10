import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState, type ComponentProps, type ComponentRef } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { colores, espaciado, fuentes, radio } from '@/constants/theme';

export interface OpcionMenu {
  texto: string;
  icono: ComponentProps<typeof Ionicons>['name'];
  peligro?: boolean;
  onPress: () => void;
}

interface Posicion {
  top: number;
  right: number;
}

export function MenuDesplegable({ opciones }: { opciones: OpcionMenu[] }) {
  const boton = useRef<ComponentRef<typeof Pressable>>(null);
  const [posicion, setPosicion] = useState<Posicion | null>(null);
  const { width } = useWindowDimensions();

  function abrir() {
    boton.current?.measureInWindow((x, y, ancho, alto) => {
      setPosicion({ top: y + alto + espaciado.xs, right: width - (x + ancho) });
    });
  }

  function elegir(opcion: OpcionMenu) {
    setPosicion(null);
    opcion.onPress();
  }

  return (
    <>
      <Pressable ref={boton} onPress={abrir} hitSlop={12} style={styles.boton}>
        <Ionicons name="ellipsis-vertical" size={20} color={colores.textoSecundario} />
      </Pressable>

      <Modal
        visible={posicion !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPosicion(null)}
        statusBarTranslucent
        navigationBarTranslucent
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setPosicion(null)}>
          {posicion ? (
            <View style={[styles.menu, posicion]}>
              {opciones.map((opcion, indice) => {
                const color = opcion.peligro ? colores.negativo : colores.texto;
                return (
                  <Pressable
                    key={opcion.texto}
                    style={({ pressed }) => [
                      styles.opcion,
                      indice > 0 && styles.separador,
                      pressed && styles.presionada,
                    ]}
                    onPress={() => elegir(opcion)}
                  >
                    <Ionicons name={opcion.icono} size={18} color={color} />
                    <Text style={[styles.texto, { color }]}>{opcion.texto}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  boton: {
    padding: espaciado.xs,
  },
  menu: {
    position: 'absolute',
    minWidth: 200,
    backgroundColor: colores.superficieElevada,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.lg,
  },
  separador: {
    borderTopWidth: 1,
    borderTopColor: colores.borde,
  },
  presionada: {
    backgroundColor: colores.borde,
  },
  texto: {
    fontFamily: fuentes.textoMedio,
    fontSize: 14,
  },
});
