import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/api/client';
import { Boton } from '@/components/Boton';
import { Campo } from '@/components/Campo';
import { Marca } from '@/components/Marca';
import { PantallaFormulario } from '@/components/PantallaFormulario';
import { colores, espaciado, fuentes } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { iniciarSesion } = useAuth();
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    if (!identificador.trim() || !password) {
      setError('Completá usuario y contraseña.');
      return;
    }

    setError(null);
    setEnviando(true);
    try {
      await iniciarSesion(identificador.trim(), password);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Ocurrió un error inesperado.');
      setEnviando(false);
    }
  }

  return (
    <PantallaFormulario>
      <Marca tamano={40} />

      <View style={styles.encabezado}>
        <Text style={styles.titulo}>INICIAR SESIÓN</Text>
        <Text style={styles.subtitulo}>Armá tu equipo y competí en la Liga Nacional.</Text>
      </View>

      <Campo
        etiqueta="Usuario o correo electrónico"
        value={identificador}
        onChangeText={setIdentificador}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <Campo
        etiqueta="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Boton titulo="Ingresar" onPress={enviar} cargando={enviando} />
      <Boton
        titulo="Crear cuenta"
        variante="secundario"
        onPress={() => router.push('/registro')}
        deshabilitado={enviando}
      />
    </PantallaFormulario>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    gap: espaciado.xs,
    marginTop: espaciado.lg,
  },
  titulo: {
    fontFamily: fuentes.titulo,
    fontSize: 28,
    color: colores.texto,
  },
  subtitulo: {
    fontFamily: fuentes.texto,
    fontSize: 14,
    color: colores.textoSecundario,
  },
  error: {
    fontFamily: fuentes.textoMedio,
    fontSize: 13,
    color: colores.negativo,
  },
});
