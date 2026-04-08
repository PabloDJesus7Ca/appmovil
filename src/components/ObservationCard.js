/**
 * ObservationCard.js
 * Tarjeta que muestra el resumen de una observación en la lista.
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS } from '../theme';

// Ícono según categoría
const CATEGORIA_ICON = {
  'Astronomía':                    'planet-outline',
  'Fenómeno atmosférico':          'cloudy-outline',
  'Aves':                          'leaf-outline',
  'Aeronave / Objeto artificial':  'airplane-outline',
  'Otro':                          'help-circle-outline',
};

export default function ObservationCard({ observacion, onPress }) {
  const iconName = CATEGORIA_ICON[observacion.categoria] ?? 'eye-outline';
  const catColor = COLORS.catColors[observacion.categoria] ?? COLORS.accent;

  // Formatear fecha legible
  const fecha = new Date(observacion.fecha_hora).toLocaleDateString('es-DO', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Miniatura de foto (si existe) */}
      {observacion.foto_path ? (
        <Image source={{ uri: observacion.foto_path }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <Ionicons name={iconName} size={28} color={catColor} />
        </View>
      )}

      {/* Información principal */}
      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={1}>
          {observacion.titulo}
        </Text>

        {/* Chip de categoría */}
        <View style={[styles.chip, { borderColor: catColor }]}>
          <Text style={[styles.chipText, { color: catColor }]}>
            {observacion.categoria}
          </Text>
        </View>

        {/* Fecha y ubicación */}
        <Text style={styles.meta}>
          🕒 {fecha}
          {observacion.ubicacion_texto
            ? `  📍 ${observacion.ubicacion_texto}`
            : observacion.lat
            ? `  📍 GPS`
            : ''}
        </Text>
      </View>

      {/* Flecha */}
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.sm,
  },
  thumbPlaceholder: {
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  titulo: {
    color: COLORS.textPrimary,
    fontSize: FONT.md,
    fontWeight: '600',
  },
  chip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: {
    fontSize: FONT.sm,
    fontWeight: '500',
  },
  meta: {
    color: COLORS.textSecondary,
    fontSize: FONT.sm,
  },
});
