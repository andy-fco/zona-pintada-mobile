import {
  BarlowCondensed_700Bold_Italic,
  BarlowCondensed_800ExtraBold_Italic,
} from '@expo-google-fonts/barlow-condensed';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { colores, fuentes } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/context/AuthContext';

SplashScreen.preventAutoHideAsync();

const ENCABEZADO = {
  headerShown: true,
  headerStyle: { backgroundColor: colores.fondo },
  headerTintColor: colores.texto,
  headerTitleStyle: { fontFamily: fuentes.titulo, fontSize: 22 },
  headerShadowVisible: false,
};

export default function RootLayout() {
  const [fuentesCargadas, errorFuentes] = useFonts({
    BarlowCondensed_700Bold_Italic,
    BarlowCondensed_800ExtraBold_Italic,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  if (!fuentesCargadas && !errorFuentes) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <NavegacionRaiz />
    </AuthProvider>
  );
}

function NavegacionRaiz() {
  const { usuario, cargando } = useAuth();

  useEffect(() => {
    if (!cargando) {
      SplashScreen.hideAsync();
    }
  }, [cargando]);

  if (cargando) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colores.fondo },
      }}
    >
      <Stack.Protected guard={usuario !== null}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="crear-equipo" options={{ ...ENCABEZADO, title: 'CREAR EQUIPO' }} />
        <Stack.Screen name="equipo-fantasy/[id]" options={{ ...ENCABEZADO, title: 'EQUIPO' }} />
      </Stack.Protected>
      <Stack.Protected guard={usuario === null}>
        <Stack.Screen name="login" />
        <Stack.Screen name="registro" />
      </Stack.Protected>
    </Stack>
  );
}
