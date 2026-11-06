import Ionicons from '@expo/vector-icons/Ionicons';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, fuentes } from '@/constants/theme';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

const ICONOS: Record<string, { inactivo: NombreIcono; activo: NombreIcono }> = {
  index: { inactivo: 'home-outline', activo: 'home' },
  competencia: { inactivo: 'stats-chart-outline', activo: 'stats-chart' },
  equipo: { inactivo: 'basketball', activo: 'basketball' },
  lnb: { inactivo: 'trophy-outline', activo: 'trophy' },
  perfil: { inactivo: 'person-outline', activo: 'person' },
};

const SECCION_CENTRAL = 'equipo';

export function BarraNavegacion({ state, descriptors, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.barra, { paddingBottom: Math.max(insets.bottom, espaciado.sm) }]}>
      {state.routes.map((ruta, indice) => {
        const activa = indice === state.index;
        const central = ruta.name === SECCION_CENTRAL;
        const iconos = ICONOS[ruta.name];
        const titulo = descriptors[ruta.key].options.title ?? ruta.name;
        const color = activa ? colores.naranja : colores.textoTenue;

        return (
          <Pressable
            key={ruta.key}
            style={styles.item}
            onPress={() => {
              if (!activa) {
                navigateToTab(ruta.key);
              }
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: activa }}
          >
            {central ? (
              <View style={[styles.botonCentral, activa && styles.botonCentralActivo]}>
                <Ionicons name={iconos.activo} size={30} color={colores.texto} />
              </View>
            ) : (
              <Ionicons name={activa ? iconos.activo : iconos.inactivo} size={22} color={color} />
            )}
            <Text style={[styles.etiqueta, { color }]}>{titulo.toUpperCase()}</Text>
            {activa && !central ? <View style={styles.indicador} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colores.superficie,
    borderTopWidth: 1,
    borderTopColor: colores.borde,
    paddingTop: espaciado.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  botonCentral: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: -28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.superficieElevada,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  botonCentralActivo: {
    backgroundColor: colores.naranja,
    borderColor: colores.naranja,
    elevation: 8,
    shadowColor: colores.naranja,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  etiqueta: {
    fontFamily: fuentes.subtitulo,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  indicador: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: colores.naranja,
  },
});
