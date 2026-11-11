import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colores, espaciado } from '@/constants/theme';

export function PantallaFormulario({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.fondo}>
      <KeyboardAvoidingView style={styles.fondo} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: espaciado.xl,
    gap: espaciado.lg,
  },
});
