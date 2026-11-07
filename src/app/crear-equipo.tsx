import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/api/client';
import { crearEquipo, obtenerSugerencia } from '@/api/equiposFantasy';
import { listarDts, listarJugadores } from '@/api/jugadores';
import { Banco } from '@/components/Banco';
import { BarraPresupuesto } from '@/components/BarraPresupuesto';
import { Boton } from '@/components/Boton';
import { Campo } from '@/components/Campo';
import { Cancha } from '@/components/Cancha';
import { CartaJugador } from '@/components/CartaJugador';
import { Mercado } from '@/components/Mercado';
import { ModalOpciones, type Opcion } from '@/components/ModalOpciones';
import { Pantalla } from '@/components/Pantalla';
import { NOMBRE_POSICION, POSICIONES } from '@/constants/posiciones';
import { colores, espaciado, fuentes } from '@/constants/theme';
import { formatearValor, redondear } from '@/lib/formato';
import type { JugadorPlantelRequest, RolPlantel } from '@/types/equipoFantasy';
import type { DT, Jugador, Posicion } from '@/types/jugador';

const PRESUPUESTO_MAXIMO = 110;

type Destino = 'titular' | 'suplente';
type Plantel = Record<Posicion, Jugador | null>;

interface MercadoAbierto {
  modo: 'jugadores' | 'dt';
  posicion: Posicion | null;
  destino: Destino | null;
}

type Seleccion = { tipo: 'jugador'; posicion: Posicion; destino: Destino } | { tipo: 'dt' };

const PLANTEL_VACIO: Plantel = {
  base: null,
  escolta: null,
  alero: null,
  'ala-pivot': null,
  pivot: null,
};

function armarJugadores(plantel: Plantel, titular: boolean, idDestacado: number | null, rolDestacado: RolPlantel) {
  return POSICIONES.flatMap<JugadorPlantelRequest>((posicion) => {
    const jugador = plantel[posicion];
    if (!jugador) {
      return [];
    }
    return [{ jugadorId: jugador.id, titular, rol: jugador.id === idDestacado ? rolDestacado : 'normal' }];
  });
}

export default function CrearEquipo() {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [dts, setDts] = useState<DT[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [nombre, setNombre] = useState('');
  const [titulares, setTitulares] = useState<Plantel>(PLANTEL_VACIO);
  const [suplentes, setSuplentes] = useState<Plantel>(PLANTEL_VACIO);
  const [dt, setDt] = useState<DT | null>(null);
  const [capitanId, setCapitanId] = useState<number | null>(null);
  const [sextoHombreId, setSextoHombreId] = useState<number | null>(null);

  const [mercado, setMercado] = useState<MercadoAbierto | null>(null);
  const [seleccion, setSeleccion] = useState<Seleccion | null>(null);
  const [pendiente, setPendiente] = useState<Jugador | null>(null);
  const [confirmarReemplazo, setConfirmarReemplazo] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const [listaJugadores, listaDts] = await Promise.all([listarJugadores(), listarDts()]);
        setJugadores([...listaJugadores].sort((a, b) => b.valor - a.valor));
        setDts([...listaDts].sort((a, b) => b.valor - a.valor));
      } catch (e) {
        setErrorCarga(e instanceof ApiError ? e.message : 'No se pudieron cargar los jugadores.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const elegidos = [...Object.values(titulares), ...Object.values(suplentes)].filter(
    (jugador): jugador is Jugador => jugador !== null,
  );
  const gastado = redondear(elegidos.reduce((suma, jugador) => suma + jugador.valor, 0) + (dt?.valor ?? 0));
  const disponible = redondear(PRESUPUESTO_MAXIMO - gastado);

  const faltantes: string[] = [];
  if (!nombre.trim()) faltantes.push('el nombre del equipo');
  if (elegidos.length < 10) faltantes.push(`${10 - elegidos.length} jugador(es)`);
  if (!dt) faltantes.push('el DT');
  if (capitanId === null) faltantes.push('el capitán');
  if (sextoHombreId === null) faltantes.push('el sexto hombre');
  const valido = faltantes.length === 0 && disponible >= 0;

  function plantelDe(destino: Destino) {
    return destino === 'titular' ? titulares : suplentes;
  }

  function motivoBloqueoJugador(jugador: Jugador) {
    if (elegidos.some((elegido) => elegido.id === jugador.id)) {
      return 'En tu plantel';
    }
    if (titulares[jugador.posicion] && suplentes[jugador.posicion]) {
      return 'Posición completa';
    }
    if (jugador.valor > disponible) {
      return 'Sin presupuesto';
    }
    return null;
  }

  function motivoBloqueoDt(opcion: DT) {
    return opcion.valor > disponible ? 'Sin presupuesto' : null;
  }

  function agregar(jugador: Jugador, destino: Destino) {
    const actualizar = destino === 'titular' ? setTitulares : setSuplentes;
    actualizar((actual) => ({ ...actual, [jugador.posicion]: jugador }));
  }

  function elegirJugador(jugador: Jugador) {
    const destinoFijo = mercado?.destino ?? null;
    setMercado(null);

    if (destinoFijo) {
      agregar(jugador, destinoFijo);
      return;
    }

    const titularLibre = titulares[jugador.posicion] === null;
    const suplenteLibre = suplentes[jugador.posicion] === null;
    if (titularLibre && suplenteLibre) {
      setPendiente(jugador);
      return;
    }
    agregar(jugador, titularLibre ? 'titular' : 'suplente');
  }

  function elegirDt(opcion: DT) {
    setDt(opcion);
    setMercado(null);
  }

  function quitar(posicion: Posicion, destino: Destino) {
    const jugador = plantelDe(destino)[posicion];
    if (jugador?.id === capitanId) setCapitanId(null);
    if (jugador?.id === sextoHombreId) setSextoHombreId(null);

    const actualizar = destino === 'titular' ? setTitulares : setSuplentes;
    actualizar((actual) => ({ ...actual, [posicion]: null }));
  }

  function tocarPuesto(posicion: Posicion, destino: Destino) {
    if (plantelDe(destino)[posicion]) {
      setSeleccion({ tipo: 'jugador', posicion, destino });
    } else {
      setMercado({ modo: 'jugadores', posicion, destino });
    }
  }

  function tocarDt() {
    if (dt) {
      setSeleccion({ tipo: 'dt' });
    } else {
      setMercado({ modo: 'dt', posicion: null, destino: null });
    }
  }

  function pedirGeneracion() {
    if (elegidos.length > 0 || dt) {
      setConfirmarReemplazo(true);
    } else {
      generar();
    }
  }

  async function generar() {
    setConfirmarReemplazo(false);
    setErrorEnvio(null);
    setGenerando(true);
    try {
      const sugerencia = await obtenerSugerencia();
      const jugadoresPorId = new Map(jugadores.map((jugador) => [jugador.id, jugador]));
      const nuevosTitulares: Plantel = { ...PLANTEL_VACIO };
      const nuevosSuplentes: Plantel = { ...PLANTEL_VACIO };
      let nuevoCapitanId: number | null = null;
      let nuevoSextoHombreId: number | null = null;

      for (const item of sugerencia.jugadores) {
        const jugador = jugadoresPorId.get(item.jugadorId);
        if (!jugador) {
          continue;
        }
        if (item.titular) {
          nuevosTitulares[jugador.posicion] = jugador;
        } else {
          nuevosSuplentes[jugador.posicion] = jugador;
        }
        if (item.rol === 'capitan') nuevoCapitanId = jugador.id;
        if (item.rol === 'sexto_hombre') nuevoSextoHombreId = jugador.id;
      }

      setTitulares(nuevosTitulares);
      setSuplentes(nuevosSuplentes);
      setDt(dts.find((opcion) => opcion.id === sugerencia.dtId) ?? null);
      setCapitanId(nuevoCapitanId);
      setSextoHombreId(nuevoSextoHombreId);
    } catch (e) {
      setErrorEnvio(e instanceof ApiError ? e.message : 'No se pudo generar el equipo.');
    } finally {
      setGenerando(false);
    }
  }

  async function confirmar() {
    if (!valido || !dt) {
      return;
    }

    setErrorEnvio(null);
    setEnviando(true);
    try {
      await crearEquipo({
        nombre: nombre.trim(),
        dtId: dt.id,
        jugadores: [
          ...armarJugadores(titulares, true, capitanId, 'capitan'),
          ...armarJugadores(suplentes, false, sextoHombreId, 'sexto_hombre'),
        ],
      });
      router.back();
    } catch (e) {
      setErrorEnvio(e instanceof ApiError ? e.message : 'No se pudo crear el equipo.');
      setEnviando(false);
    }
  }

  function renderCarta(posicion: Posicion, destino: Destino) {
    const jugador = plantelDe(destino)[posicion];
    const destacadoId = destino === 'titular' ? capitanId : sextoHombreId;
    return (
      <CartaJugador
        etiqueta={NOMBRE_POSICION[posicion]}
        nombre={jugador?.apellido ?? null}
        dato={jugador ? formatearValor(jugador.valor) : undefined}
        insignia={jugador && jugador.id === destacadoId ? (destino === 'titular' ? 'C' : '6º') : null}
        onPress={() => tocarPuesto(posicion, destino)}
        style={destino === 'suplente' ? styles.cartaBanco : undefined}
      />
    );
  }

  function opcionesSeleccion(): { titulo: string; mensaje: string; opciones: Opcion[] } | null {
    if (!seleccion) {
      return null;
    }

    if (seleccion.tipo === 'dt') {
      if (!dt) return null;
      return {
        titulo: `${dt.nombre} ${dt.apellido}`,
        mensaje: `${dt.equipoNombre} · ${formatearValor(dt.valor)}`,
        opciones: [
          {
            texto: 'Cambiar DT',
            onPress: () => {
              setDt(null);
              setSeleccion(null);
              setMercado({ modo: 'dt', posicion: null, destino: null });
            },
          },
          {
            texto: 'Quitar',
            variante: 'peligro',
            onPress: () => {
              setDt(null);
              setSeleccion(null);
            },
          },
        ],
      };
    }

    const { posicion, destino } = seleccion;
    const jugador = plantelDe(destino)[posicion];
    if (!jugador) return null;

    const esTitular = destino === 'titular';
    const yaDestacado = jugador.id === (esTitular ? capitanId : sextoHombreId);
    const opciones: Opcion[] = [];

    if (!yaDestacado) {
      opciones.push({
        texto: esTitular ? 'Nombrar capitán' : 'Nombrar sexto hombre',
        onPress: () => {
          if (esTitular) setCapitanId(jugador.id);
          else setSextoHombreId(jugador.id);
          setSeleccion(null);
        },
      });
    }
    opciones.push(
      {
        texto: 'Cambiar jugador',
        variante: 'secundario',
        onPress: () => {
          quitar(posicion, destino);
          setSeleccion(null);
          setMercado({ modo: 'jugadores', posicion, destino });
        },
      },
      {
        texto: 'Quitar del equipo',
        variante: 'peligro',
        onPress: () => {
          quitar(posicion, destino);
          setSeleccion(null);
        },
      },
    );

    const rol = yaDestacado ? (esTitular ? ' · Capitán' : ' · Sexto hombre') : '';
    return {
      titulo: `${jugador.nombre} ${jugador.apellido}`,
      mensaje: `${jugador.equipoNombre} · ${NOMBRE_POSICION[posicion]} ${destino} · ${formatearValor(jugador.valor)}${rol}`,
      opciones,
    };
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator color={colores.naranja} size="large" />
      </View>
    );
  }

  if (errorCarga) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{errorCarga}</Text>
      </View>
    );
  }

  const hoja = opcionesSeleccion();

  return (
    <>
      <Pantalla>
        <Campo
          etiqueta="Nombre del equipo"
          value={nombre}
          onChangeText={setNombre}
          maxLength={100}
          placeholder="Ej: Los Cóndores"
        />

        <BarraPresupuesto gastado={gastado} maximo={PRESUPUESTO_MAXIMO} />

        <View style={styles.acciones}>
          <View style={styles.accion}>
            <Boton titulo="Autogenerar" variante="secundario" onPress={pedirGeneracion} cargando={generando} />
          </View>
          <View style={styles.accion}>
            <Boton
              titulo="Mercado"
              variante="secundario"
              onPress={() => setMercado({ modo: 'jugadores', posicion: null, destino: null })}
            />
          </View>
        </View>

        <Text style={styles.ayuda}>
          Tocá un puesto vacío para elegir. Tocá un jugador para nombrarlo capitán, sexto hombre o cambiarlo.
        </Text>

        <Cancha renderPuesto={(posicion) => renderCarta(posicion, 'titular')} />

        <Banco
          dt={
            <CartaJugador
              etiqueta="DT"
              nombre={dt?.apellido ?? null}
              dato={dt ? formatearValor(dt.valor) : undefined}
              onPress={tocarDt}
            />
          }
          descripcionDt="Suma los puntos de su equipo en cada partido, sin multiplicador."
          renderSuplente={(posicion) => renderCarta(posicion, 'suplente')}
        />

        {faltantes.length > 0 ? <Text style={styles.ayuda}>Falta: {faltantes.join(', ')}.</Text> : null}
        {disponible < 0 ? <Text style={styles.error}>El plantel supera el presupuesto.</Text> : null}
        {errorEnvio ? <Text style={styles.error}>{errorEnvio}</Text> : null}

        <Boton titulo="Confirmar equipo" onPress={confirmar} cargando={enviando} deshabilitado={!valido} />
      </Pantalla>

      {mercado ? (
        <Mercado
          modo={mercado.modo}
          titulo={
            mercado.modo === 'dt'
              ? 'Elegir DT'
              : mercado.posicion && mercado.destino
                ? `${NOMBRE_POSICION[mercado.posicion]} ${mercado.destino}`
                : 'Mercado'
          }
          posicionFija={mercado.posicion}
          jugadores={jugadores}
          dts={dts}
          motivoBloqueoJugador={motivoBloqueoJugador}
          motivoBloqueoDt={motivoBloqueoDt}
          onElegirJugador={elegirJugador}
          onElegirDt={elegirDt}
          onCerrar={() => setMercado(null)}
        />
      ) : null}

      {pendiente ? (
        <ModalOpciones
          titulo={`${pendiente.nombre} ${pendiente.apellido}`}
          mensaje={`${NOMBRE_POSICION[pendiente.posicion]} · ${pendiente.equipoNombre}. ¿Lo agregás como titular o como suplente?`}
          opciones={[
            {
              texto: 'Titular',
              onPress: () => {
                agregar(pendiente, 'titular');
                setPendiente(null);
              },
            },
            {
              texto: 'Suplente',
              variante: 'secundario',
              onPress: () => {
                agregar(pendiente, 'suplente');
                setPendiente(null);
              },
            },
          ]}
          onCerrar={() => setPendiente(null)}
        />
      ) : null}

      {confirmarReemplazo ? (
        <ModalOpciones
          titulo="Autogenerar equipo"
          mensaje="Se va a reemplazar el plantel que armaste hasta ahora por uno generado automáticamente."
          opciones={[{ texto: 'Generar', onPress: generar }]}
          onCerrar={() => setConfirmarReemplazo(false)}
        />
      ) : null}

      {hoja ? (
        <ModalOpciones
          titulo={hoja.titulo}
          mensaje={hoja.mensaje}
          opciones={hoja.opciones}
          onCerrar={() => setSeleccion(null)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaciado.xl,
    backgroundColor: colores.fondo,
  },
  cartaBanco: {
    width: '100%',
  },
  acciones: {
    flexDirection: 'row',
    gap: espaciado.sm,
  },
  accion: {
    flex: 1,
  },
  ayuda: {
    fontFamily: fuentes.texto,
    fontSize: 13,
    color: colores.textoSecundario,
  },
  error: {
    fontFamily: fuentes.textoMedio,
    fontSize: 13,
    color: colores.negativo,
  },
});
