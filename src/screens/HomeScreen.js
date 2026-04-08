/**
 * HomeScreen.js
 * Pantalla principal: lista de observaciones + filtros + botón "Borrar Todo".
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerObservaciones, borrarTodo } from '../database';
import ObservationCard from '../components/ObservationCard';
import { COLORS, FONT, RADIUS } from '../theme';

// Filtros de categoría disponibles
const CATEGORIAS = [
  'Todas',
  'Astronomía',
  'Fenómeno atmosférico',
  'Aves',
  'Aeronave / Objeto artificial',
  'Otro',
];

export default function HomeScreen({ navigation }) {
  const [observaciones, setObservaciones] = useState([]);
  const [filtro, setFiltro] = useState('Todas');

  // Recargar lista cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      cargarObservaciones();
    }, [])
  );

  function cargarObservaciones() {
    const datos = obtenerObservaciones();
    setObservaciones(datos);
  }

  // Filtrar según categoría seleccionada
  const listaFiltrada = filtro === 'Todas'
    ? observaciones
    : observaciones.filter(o => o.categoria === filtro);

  // Confirmar y borrar todo
  function confirmarBorrarTodo() {
    Alert.alert(
      '⚠️ Borrar Todo',
      '¿Estás seguro? Se eliminarán TODAS las observaciones del dispositivo. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar Todo',
          style: 'destructive',
          onPress: () => {
            borrarTodo();
            cargarObservaciones();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>

      {/* ── Encabezado ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>🌌 CieloObs</Text>
          <Text style={styles.subtitle}>Observador del Cielo · RD</Text>
        </View>
        {/* Botón perfil */}
        <TouchableOpacity onPress={() => navigation.navigate('Acerca')}>
          <Ionicons name="person-circle-outline" size={34} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {/* ── Filtros de categoría ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosScroll}
        contentContainerStyle={styles.filtrosContent}
      >
        {CATEGORIAS.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.filtroChip, filtro === cat && styles.filtroActivo]}
            onPress={() => setFiltro(cat)}
          >
            <Text style={[styles.filtroText, filtro === cat && styles.filtroTextoActivo]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Lista de observaciones ── */}
      {listaFiltrada.length === 0 ? (
        <View style={styles.vacio}>
          <Text style={styles.vacioIcono}>🔭</Text>
          <Text style={styles.vacioText}>No hay observaciones aún.</Text>
          <Text style={styles.vacioSub}>Toca el botón + para registrar una.</Text>
        </View>
      ) : (
        <FlatList
          data={listaFiltrada}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <ObservationCard
              observacion={item}
              onPress={() => navigation.navigate('Detalle', { id: item.id })}
            />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ── Botón "Borrar Todo" ── */}
      {observaciones.length > 0 && (
        <TouchableOpacity style={styles.btnBorrar} onPress={confirmarBorrarTodo}>
          <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
          <Text style={styles.btnBorrarText}>Borrar Todo</Text>
        </TouchableOpacity>
      )}

      {/* ── Botón flotante: Nueva observación ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NuevaObservacion')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
  },

  // Encabezado
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
  },
  appName: {
    color: COLORS.textPrimary,
    fontSize: FONT.xl,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT.sm,
    marginTop: 2,
  },

  // Filtros
  filtrosScroll: {
    marginBottom: 12,
    maxHeight: 40,
  },
  filtrosContent: {
    gap: 8,
    paddingRight: 8,
  },
  filtroChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.card,
  },
  filtroActivo: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filtroText: {
    color: COLORS.textSecondary,
    fontSize: FONT.sm,
  },
  filtroTextoActivo: {
    color: '#fff',
    fontWeight: '600',
  },

  // Lista
  lista: {
    paddingBottom: 100,
  },

  // Estado vacío
  vacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  vacioIcono: {
    fontSize: 48,
  },
  vacioText: {
    color: COLORS.textPrimary,
    fontSize: FONT.lg,
    fontWeight: '600',
  },
  vacioSub: {
    color: COLORS.textSecondary,
    fontSize: FONT.md,
  },

  // Botón Borrar Todo
  btnBorrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginBottom: 8,
  },
  btnBorrarText: {
    color: COLORS.danger,
    fontSize: FONT.md,
    fontWeight: '500',
  },

  // Botón flotante
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});
