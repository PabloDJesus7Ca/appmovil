/**
 * DetailScreen.js
 * Muestra todos los datos de una observación específica.
 * Permite eliminarla individualmente.
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Image,
  TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerObservacionPorId, eliminarObservacion } from '../database';
import { COLORS, FONT, RADIUS } from '../theme';

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params; // id pasado desde HomeScreen
  const [obs, setObs] = useState(null);

  useEffect(() => {
    // Cargar la observación al montar la pantalla
    const datos = obtenerObservacionPorId(id);
    setObs(datos);
  }, [id]);

  function confirmarEliminar() {
    Alert.alert(
      'Eliminar observación',
      '¿Deseas eliminar esta observación? La acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            eliminarObservacion(id);
            navigation.goBack();
          },
        },
      ]
    );
  }

  if (!obs) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: COLORS.textSecondary }}>Cargando...</Text>
      </View>
    );
  }

  // Formatear fecha legible
  const fecha = new Date(obs.fecha_hora).toLocaleString('es-DO', {
    weekday: 'long', day: '2-digit', month: 'long',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Foto principal */}
      {obs.foto_path ? (
        <Image source={{ uri: obs.foto_path }} style={styles.foto} />
      ) : (
        <View style={styles.fotoPlaceholder}>
          <Text style={styles.fotoPlaceholderIcon}>🔭</Text>
          <Text style={styles.fotoPlaceholderText}>Sin foto adjunta</Text>
        </View>
      )}

      {/* Título y categoría */}
      <Text style={styles.titulo}>{obs.titulo}</Text>
      <View style={styles.chipRow}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{obs.categoria}</Text>
        </View>
        <View style={[styles.chip, { borderColor: COLORS.accentAlt }]}>
          <Text style={[styles.chipText, { color: COLORS.accentAlt }]}>
            {obs.condiciones_cielo}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Datos de la observación */}
      <InfoFila icono="time-outline"     texto={`Fecha: ${fecha}`} />
      {obs.duracion_seg && (
        <InfoFila icono="timer-outline"  texto={`Duración: ${obs.duracion_seg} seg`} />
      )}
      {obs.lat ? (
        <InfoFila icono="location-outline" texto={`GPS: ${obs.lat.toFixed(5)}, ${obs.lng.toFixed(5)}`} />
      ) : obs.ubicacion_texto ? (
        <InfoFila icono="map-outline"    texto={`Lugar: ${obs.ubicacion_texto}`} />
      ) : (
        <InfoFila icono="map-outline"    texto="Ubicación: No registrada" />
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Descripción */}
      <Text style={styles.seccion}>📝 Descripción</Text>
      <Text style={styles.descripcion}>{obs.descripcion}</Text>

      {/* Nota de voz (si existe) */}
      {obs.audio_path && (
        <>
          <View style={styles.divider} />
          <Text style={styles.seccion}>🎤 Nota de Voz</Text>
          {/* Aquí va el reproductor de expo-av */}
          <View style={styles.audioPlaceholder}>
            <Ionicons name="play-circle-outline" size={32} color={COLORS.accent} />
            <Text style={styles.audioText}>Reproducir nota de voz</Text>
          </View>
        </>
      )}

      {/* Botón eliminar */}
      <TouchableOpacity style={styles.btnEliminar} onPress={confirmarEliminar}>
        <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
        <Text style={styles.btnEliminarText}>Eliminar observación</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// Fila de información con ícono
function InfoFila({ icono, texto }) {
  return (
    <View style={styles.infoFila}>
      <Ionicons name={icono} size={16} color={COLORS.accent} />
      <Text style={styles.infoTexto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },

  // Foto
  foto: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.md,
  },
  fotoPlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  fotoPlaceholderIcon: { fontSize: 36 },
  fotoPlaceholderText: { color: COLORS.textMuted, fontSize: FONT.sm },

  // Título
  titulo: {
    color: COLORS.textPrimary,
    fontSize: FONT.xxl,
    fontWeight: '700',
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipText: {
    color: COLORS.accent,
    fontSize: FONT.sm,
    fontWeight: '500',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: 4,
  },

  // Filas de info
  infoFila: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoTexto: {
    color: COLORS.textSecondary,
    fontSize: FONT.md,
    flex: 1,
  },

  // Sección
  seccion: {
    color: COLORS.textPrimary,
    fontSize: FONT.lg,
    fontWeight: '600',
  },
  descripcion: {
    color: COLORS.textSecondary,
    fontSize: FONT.md,
    lineHeight: 22,
  },

  // Audio
  audioPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.sm,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  audioText: {
    color: COLORS.accent,
    fontSize: FONT.md,
  },

  // Eliminar
  btnEliminar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  btnEliminarText: {
    color: COLORS.danger,
    fontSize: FONT.md,
    fontWeight: '500',
  },
});
