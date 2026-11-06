import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { colores, espaciado } from '@/constants/theme';

export function Pantalla({ children }: { children: ReactNode }) {
  return (
    <ScrollView style={styles.fondo} contentContainerStyle={styles.contenido}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    padding: espaciado.lg,
    paddingBottom: espaciado.xxl * 2,
    gap: espaciado.lg,
  },
});
