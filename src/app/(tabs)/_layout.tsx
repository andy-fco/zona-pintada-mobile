import { Tabs } from 'expo-router';

import { colores } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colores.superficie, borderTopColor: colores.borde },
        tabBarActiveTintColor: colores.naranja,
        tabBarInactiveTintColor: colores.textoTenue,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
    </Tabs>
  );
}
