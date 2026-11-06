import { Tabs } from 'expo-router/js-tabs';

import { BarraNavegacion } from '@/components/BarraNavegacion';
import { Encabezado } from '@/components/Encabezado';
import { colores } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BarraNavegacion {...props} />}
      screenOptions={{
        header: () => <Encabezado />,
        sceneStyle: { backgroundColor: colores.fondo },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="competencia" options={{ title: 'Competencia' }} />
      <Tabs.Screen name="equipo" options={{ title: 'Mi Equipo' }} />
      <Tabs.Screen name="lnb" options={{ title: 'LNB' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
