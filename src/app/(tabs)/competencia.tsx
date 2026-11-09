import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/api/client';
import { obtenerRankingGeneral, obtenerRankingSemanal } from '@/api/rankings';
import { Boton } from '@/components/Boton';
import { EstadoVacio } from '@/components/EstadoVacio';
import { FilaRanking } from '@/components/FilaRanking';
import { Pantalla } from '@/components/Pantalla';
import { Selector } from '@/components/Selector';
import { SelectorSemana } from '@/components/SelectorSemana';
import { TituloSeccion } from '@/components/TituloSeccion';
import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import { useSemanasDisponibles } from '@/hooks/useSemanasDisponibles';
import type { PosicionRanking, Ranking } from '@/types/ranking';

type Vista = 'general' | 'semanal';

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'listo'; ranking: Ranking };

const VISTAS = [
  { valor: 'general' as const, texto: 'General' },
  { valor: 'semanal' as const, texto: 'Semanal' },
];

function pedirRanking(vista: Vista, semanaId: number | null, pagina: number) {
  if (vista === 'semanal' && semanaId !== null) {
    return obtenerRankingSemanal(semanaId, pagina);
  }
  return obtenerRankingGeneral(pagina);
}

function mensajeDeError(e: unknown) {
  return e instanceof ApiError ? e.message : 'No se pudo cargar el ranking.';
}

export default function Competencia() {
  const [vista, setVista] = useState<Vista>('general');
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' });
  const [cargandoMas, setCargandoMas] = useState(false);
  const [errorMas, setErrorMas] = useState<string | null>(null);
  const semanas = useSemanasDisponibles();

  const esperandoSemanas = vista === 'semanal' && semanas.cargando;
  const semanaConsultada = vista === 'semanal' ? (semanas.semana?.id ?? null) : null;

  useFocusEffect(
    useCallback(() => {
      let vigente = true;

      async function cargar() {
        if (esperandoSemanas) {
          setEstado({ tipo: 'cargando' });
          return;
        }
        if (vista === 'semanal' && semanaConsultada === null) {
          setEstado({ tipo: 'error', mensaje: 'Todavía no hay semanas para mostrar.' });
          return;
        }
        setEstado({ tipo: 'cargando' });
        setErrorMas(null);
        try {
          const ranking = await pedirRanking(vista, semanaConsultada, 1);
          if (vigente) {
            setEstado({ tipo: 'listo', ranking });
          }
        } catch (e) {
          if (vigente) {
            setEstado({ tipo: 'error', mensaje: mensajeDeError(e) });
          }
        }
      }

      cargar();
      return () => {
        vigente = false;
      };
    }, [vista, esperandoSemanas, semanaConsultada]),
  );

  async function cargarMas() {
    if (estado.tipo !== 'listo') {
      return;
    }
    const actual = estado.ranking;
    setCargandoMas(true);
    setErrorMas(null);
    try {
      const siguiente = await pedirRanking(vista, semanaConsultada, actual.pagina + 1);
      setEstado({
        tipo: 'listo',
        ranking: { ...siguiente, posiciones: [...actual.posiciones, ...siguiente.posiciones] },
      });
    } catch (e) {
      setErrorMas(mensajeDeError(e));
    } finally {
      setCargandoMas(false);
    }
  }

  function abrirEquipo(fila: PosicionRanking, propia: boolean) {
    if (propia) {
      router.navigate('/equipo');
      return;
    }
    router.push({
      pathname: '/equipo-fantasy/[id]',
      params:
        semanaConsultada !== null
          ? { id: String(fila.equipoFantasyId), semanaId: String(semanaConsultada) }
          : { id: String(fila.equipoFantasyId) },
    });
  }

  return (
    <Pantalla>
      <TituloSeccion etiqueta="Temporada regular" titulo="Ranking nacional" />

      <Selector opciones={VISTAS} seleccionado={vista} onCambiar={setVista} />

      {vista === 'semanal' && semanas.semana ? (
        <SelectorSemana
          semana={semanas.semana}
          puedeRetroceder={semanas.puedeRetroceder}
          puedeAvanzar={semanas.puedeAvanzar}
          onRetroceder={semanas.retroceder}
          onAvanzar={semanas.avanzar}
        />
      ) : null}

      {estado.tipo === 'cargando' ? <ActivityIndicator color={colores.naranja} style={styles.cargando} /> : null}

      {estado.tipo === 'error' ? <EstadoVacio icono="cloud-offline-outline" mensaje={estado.mensaje} /> : null}

      {estado.tipo === 'listo' ? (
        <>
          {estado.ranking.miPosicion ? (
            <MiPosicion
              posicion={estado.ranking.miPosicion.posicion}
              total={estado.ranking.totalEquipos}
              puntos={estado.ranking.miPosicion.puntos}
            />
          ) : null}

          {estado.ranking.posiciones.length === 0 ? (
            <EstadoVacio icono="people-outline" mensaje="Todavía no hay equipos en este ranking." />
          ) : (
            <View style={styles.lista}>
              {estado.ranking.posiciones.map((fila) => {
                const propia = fila.equipoFantasyId === estado.ranking.miPosicion?.equipoFantasyId;
                return (
                  <FilaRanking
                    key={fila.equipoFantasyId}
                    fila={fila}
                    propia={propia}
                    onPress={() => abrirEquipo(fila, propia)}
                  />
                );
              })}
            </View>
          )}

          {estado.ranking.pagina < estado.ranking.totalPaginas ? (
            <Boton titulo="Ver más" variante="secundario" cargando={cargandoMas} onPress={cargarMas} />
          ) : null}
          {errorMas ? <Text style={styles.errorMas}>{errorMas}</Text> : null}
        </>
      ) : null}

      <View style={styles.ligas}>
        <Ionicons name="lock-closed-outline" size={20} color={colores.textoTenue} />
        <View style={styles.ligasTextos}>
          <Text style={styles.ligasTitulo}>LIGAS PRIVADAS</Text>
          <Text style={styles.ligasDetalle}>Competí solo con tus amigos. Próximamente.</Text>
        </View>
      </View>
    </Pantalla>
  );
}

function MiPosicion({ posicion, total, puntos }: { posicion: number; total: number; puntos: number }) {
  return (
    <View style={styles.miPosicion}>
      <View>
        <Text style={styles.miEtiqueta}>TU POSICIÓN</Text>
        <Text style={styles.miNumero}>
          #{posicion}
          <Text style={styles.miTotal}> de {total}</Text>
        </Text>
      </View>
      <View style={styles.miDerecha}>
        <Text style={styles.miEtiqueta}>PUNTOS</Text>
        <Text style={styles.miPuntos}>{puntos}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cargando: {
    marginTop: espaciado.xl,
  },
  lista: {
    gap: espaciado.sm,
  },
  errorMas: {
    fontFamily: fuentes.texto,
    fontSize: 13,
    textAlign: 'center',
    color: colores.negativo,
  },
  miPosicion: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.naranja,
    borderRadius: radio.md,
  },
  miEtiqueta: {
    fontFamily: fuentes.textoNegrita,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colores.textoSecundario,
  },
  miNumero: {
    fontFamily: fuentes.titulo,
    fontSize: 40,
    color: colores.naranja,
  },
  miTotal: {
    fontFamily: fuentes.subtitulo,
    fontSize: 18,
    color: colores.textoSecundario,
  },
  miDerecha: {
    alignItems: 'flex-end',
  },
  miPuntos: {
    fontFamily: fuentes.numeros,
    fontSize: 28,
    fontWeight: '700',
    color: colores.texto,
  },
  ligas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    padding: espaciado.lg,
    borderWidth: 1,
    borderColor: colores.borde,
    borderStyle: 'dashed',
    borderRadius: radio.md,
  },
  ligasTextos: {
    flex: 1,
    gap: 2,
  },
  ligasTitulo: {
    fontFamily: fuentes.subtitulo,
    fontSize: 16,
    color: colores.textoSecundario,
  },
  ligasDetalle: {
    fontFamily: fuentes.texto,
    fontSize: 12,
    color: colores.textoTenue,
  },
});
