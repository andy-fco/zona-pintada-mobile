import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/api/client';
import { obtenerRankingGeneral, obtenerRankingSemanal } from '@/api/rankings';
import { listarSemanas, obtenerSemanaActual } from '@/api/semanas';
import { Boton } from '@/components/Boton';
import { EstadoVacio } from '@/components/EstadoVacio';
import { FilaRanking } from '@/components/FilaRanking';
import { Pantalla } from '@/components/Pantalla';
import { Selector } from '@/components/Selector';
import { TituloSeccion } from '@/components/TituloSeccion';
import { colores, espaciado, fuentes, radio } from '@/constants/theme';
import { formatearDiaMes } from '@/lib/formato';
import type { PosicionRanking, Ranking } from '@/types/ranking';
import type { Semana } from '@/types/semana';

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
  const [semanas, setSemanas] = useState<Semana[] | null>(null);
  const [indiceSemana, setIndiceSemana] = useState(0);
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' });
  const [cargandoMas, setCargandoMas] = useState(false);
  const [errorMas, setErrorMas] = useState<string | null>(null);

  const semana = semanas && semanas.length > 0 ? semanas[indiceSemana] : null;
  const semanaId = semana?.id ?? null;
  const esperandoSemanas = vista === 'semanal' && semanas === null;
  const semanaConsultada = vista === 'semanal' ? semanaId : null;

  useEffect(() => {
    async function cargarSemanas() {
      try {
        const [todas, actual] = await Promise.all([listarSemanas(), obtenerSemanaActual().catch(() => null)]);
        const disponibles = todas.filter(
          (item) => item.cerradaAt !== null || (actual !== null && item.numeroSemana <= actual.numeroSemana),
        );
        setSemanas(disponibles);
        setIndiceSemana(Math.max(disponibles.length - 1, 0));
      } catch {
        setSemanas([]);
      }
    }
    cargarSemanas();
  }, []);

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

      {vista === 'semanal' && semana && semanas ? (
        <SelectorSemana
          semana={semana}
          puedeRetroceder={indiceSemana > 0}
          puedeAvanzar={indiceSemana < semanas.length - 1}
          onRetroceder={() => setIndiceSemana(indiceSemana - 1)}
          onAvanzar={() => setIndiceSemana(indiceSemana + 1)}
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

function SelectorSemana({
  semana,
  puedeRetroceder,
  puedeAvanzar,
  onRetroceder,
  onAvanzar,
}: {
  semana: Semana;
  puedeRetroceder: boolean;
  puedeAvanzar: boolean;
  onRetroceder: () => void;
  onAvanzar: () => void;
}) {
  return (
    <View style={styles.semana}>
      <Pressable onPress={onRetroceder} disabled={!puedeRetroceder} hitSlop={10}>
        <Ionicons
          name="chevron-back"
          size={24}
          color={puedeRetroceder ? colores.texto : colores.borde}
        />
      </Pressable>
      <View style={styles.semanaTextos}>
        <Text style={styles.semanaTitulo}>SEMANA {semana.numeroSemana}</Text>
        <Text style={styles.semanaDetalle}>
          {formatearDiaMes(semana.fechaInicio)} al {formatearDiaMes(semana.fechaFin)} ·{' '}
          {semana.cerradaAt ? 'Cerrada' : 'En curso'}
        </Text>
      </View>
      <Pressable onPress={onAvanzar} disabled={!puedeAvanzar} hitSlop={10}>
        <Ionicons name="chevron-forward" size={24} color={puedeAvanzar ? colores.texto : colores.borde} />
      </Pressable>
    </View>
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
  semana: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: espaciado.sm,
  },
  semanaTextos: {
    alignItems: 'center',
    gap: 2,
  },
  semanaTitulo: {
    fontFamily: fuentes.subtitulo,
    fontSize: 20,
    color: colores.texto,
  },
  semanaDetalle: {
    fontFamily: fuentes.texto,
    fontSize: 12,
    color: colores.textoSecundario,
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
