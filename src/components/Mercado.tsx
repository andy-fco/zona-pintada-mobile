import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { NOMBRE_POSICION, POSICIONES, SIGLA_POSICION } from '@/constants/posiciones';
import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import { formatearValor, normalizar } from '@/lib/formato';
import type { DT, Jugador, Posicion } from '@/types/jugador';

interface Props {
  modo: 'jugadores' | 'dt';
  titulo: string;
  posicionFija: Posicion | null;
  jugadores: Jugador[];
  dts: DT[];
  motivoBloqueoJugador: (jugador: Jugador) => string | null;
  motivoBloqueoDt: (dt: DT) => string | null;
  onElegirJugador: (jugador: Jugador) => void;
  onElegirDt: (dt: DT) => void;
  onCerrar: () => void;
}

interface Opcion {
  id: number;
  nombre: string;
  apellido: string;
  equipoNombre: string;
  valor: number;
  sigla: string;
  detalle: string;
  motivoBloqueo: string | null;
  elegir: () => void;
}

export function Mercado({
  modo,
  titulo,
  posicionFija,
  jugadores,
  dts,
  motivoBloqueoJugador,
  motivoBloqueoDt,
  onElegirJugador,
  onElegirDt,
  onCerrar,
}: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Posicion | null>(null);

  const posicion = posicionFija ?? filtro;
  const texto = normalizar(busqueda);

  function coincide(item: { nombre: string; apellido: string; equipoNombre: string }) {
    return normalizar(`${item.nombre} ${item.apellido} ${item.equipoNombre}`).includes(texto);
  }

  const opciones: Opcion[] =
    modo === 'dt'
      ? dts.filter(coincide).map((dt) => ({
          ...dt,
          sigla: 'DT',
          detalle: dt.equipoNombre,
          motivoBloqueo: motivoBloqueoDt(dt),
          elegir: () => onElegirDt(dt),
        }))
      : jugadores
          .filter((jugador) => (posicion === null || jugador.posicion === posicion) && coincide(jugador))
          .map((jugador) => ({
            ...jugador,
            sigla: SIGLA_POSICION[jugador.posicion],
            detalle: `${jugador.equipoNombre} · ${NOMBRE_POSICION[jugador.posicion]}`,
            motivoBloqueo: motivoBloqueoJugador(jugador),
            elegir: () => onElegirJugador(jugador),
          }));

  return (
    <Modal visible animationType="slide" onRequestClose={onCerrar} statusBarTranslucent navigationBarTranslucent>
      <SafeAreaProvider>
        <SafeAreaView style={styles.fondo}>
          <View style={styles.encabezado}>
            <Text style={styles.titulo}>{titulo.toUpperCase()}</Text>
            <Pressable onPress={onCerrar} hitSlop={10}>
              <Ionicons name="close" size={28} color={colores.texto} />
            </Pressable>
          </View>

          <View style={styles.buscador}>
            <Ionicons name="search" size={18} color={colores.textoTenue} />
            <TextInput
              value={busqueda}
              onChangeText={setBusqueda}
              placeholder="Buscar por nombre o club"
              placeholderTextColor={colores.textoTenue}
              autoCorrect={false}
              style={styles.input}
            />
          </View>

          {modo === 'jugadores' && posicionFija === null ? (
            <View style={styles.filtros}>
              <Filtro texto="Todos" activo={filtro === null} onPress={() => setFiltro(null)} />
              {POSICIONES.map((item) => (
                <Filtro
                  key={item}
                  texto={SIGLA_POSICION[item]}
                  activo={filtro === item}
                  onPress={() => setFiltro(item)}
                />
              ))}
            </View>
          ) : null}

          <FlatList
            data={opciones}
            keyExtractor={(opcion) => String(opcion.id)}
            contentContainerStyle={styles.lista}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={styles.sinResultados}>No hay resultados.</Text>}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.opcion, item.motivoBloqueo !== null && styles.bloqueada]}
                disabled={item.motivoBloqueo !== null}
                onPress={item.elegir}
              >
                <View style={styles.sigla}>
                  <Text style={styles.siglaTexto}>{item.sigla}</Text>
                </View>
                <View style={styles.datos}>
                  <Text style={styles.nombre} numberOfLines={1}>
                    {item.nombre} {item.apellido}
                  </Text>
                  <Text style={styles.detalle} numberOfLines={1}>
                    {item.detalle}
                  </Text>
                </View>
                <View style={styles.derecha}>
                  <Text style={styles.valor}>{formatearValor(item.valor)}</Text>
                  {item.motivoBloqueo ? <Text style={styles.motivo}>{item.motivoBloqueo}</Text> : null}
                </View>
              </Pressable>
            )}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

function Filtro({ texto, activo, onPress }: { texto: string; activo: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.filtro, activo && styles.filtroActivo]} onPress={onPress}>
      <Text style={[styles.filtroTexto, activo && styles.filtroTextoActivo]}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: espaciado.lg,
    paddingVertical: espaciado.md,
  },
  titulo: {
    fontFamily: fuentes.titulo,
    fontSize: 26,
    color: colores.texto,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    marginHorizontal: espaciado.lg,
    paddingHorizontal: espaciado.md,
    minHeight: 46,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.sm,
  },
  input: {
    flex: 1,
    fontFamily: fuentes.texto,
    fontSize: 15,
    color: colores.texto,
  },
  filtros: {
    flexDirection: 'row',
    gap: espaciado.sm,
    paddingHorizontal: espaciado.lg,
    paddingTop: espaciado.md,
  },
  filtro: {
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.xs,
    borderRadius: radio.total,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  filtroActivo: {
    backgroundColor: colores.naranja,
    borderColor: colores.naranja,
  },
  filtroTexto: {
    fontFamily: fuentes.subtitulo,
    fontSize: 14,
    color: colores.textoSecundario,
  },
  filtroTextoActivo: {
    color: colores.texto,
  },
  lista: {
    padding: espaciado.lg,
    gap: espaciado.sm,
  },
  sinResultados: {
    fontFamily: fuentes.texto,
    fontSize: 14,
    textAlign: 'center',
    color: colores.textoSecundario,
    marginTop: espaciado.xl,
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    padding: espaciado.md,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
  },
  bloqueada: {
    opacity: 0.4,
  },
  sigla: {
    width: 36,
    height: 36,
    borderRadius: radio.sm,
    borderWidth: 1,
    borderColor: colores.naranja,
    backgroundColor: colores.naranjaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  siglaTexto: {
    fontFamily: fuentes.subtitulo,
    fontSize: 14,
    color: colores.naranja,
  },
  datos: {
    flex: 1,
    gap: 2,
  },
  nombre: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 14,
    color: colores.texto,
  },
  detalle: {
    fontFamily: fuentes.texto,
    fontSize: 12,
    color: colores.textoSecundario,
  },
  derecha: {
    alignItems: 'flex-end',
    gap: 2,
  },
  valor: {
    fontFamily: fuentes.numeros,
    fontSize: 15,
    fontWeight: '700',
    color: colores.texto,
  },
  motivo: {
    fontFamily: fuentes.texto,
    fontSize: 10,
    color: colores.textoSecundario,
  },
});
