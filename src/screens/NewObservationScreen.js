/**
 * NewObservationScreen.js
 * Formulario para registrar una nueva observación del cielo.
 * Funciona 100% offline.
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, Image, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { insertarObservacion } from '../database';
import { COLORS, FONT, RADIUS } from '../theme';

// ─── Opciones de formulario ───────────────────
const CATEGORIAS = [
  'Astronomía',
  'Fenómeno atmosférico',
  'Aves',
  'Aeronave / Objeto artificial',
  'Otro',
];

const CONDICIONES = [
  'Despejado ☀️',
  'Parcialmente nublado 🌤️',
  'Nublado ☁️',
  'Bruma 🌫️',
  'Lluvia ligera 🌦️',
];

// Componente de selector de opciones (radio horizontal o en lista)
function Selector({ opciones, seleccionado, onChange, horizontal }) {
  const Wrapper = horizontal ? ScrollView : View;
  const wrapperProps = horizontal
    ? { horizontal: true, showsHorizontalScrollIndicator: false }
    : {};

  return (
    <Wrapper {...wrapperProps} contentContainerStyle={horizontal ? { gap: 8 } : { gap: 6 }}>
      {opciones.map(op => (
        <TouchableOpacity
          key={op}
          style={[
            styles.opcionChip,
            seleccionado === op && styles.opcionActiva,
          ]}
          onPress={() => onChange(op)}
        >
          <Text style={[
            styles.opcionText,
            seleccionado === op && styles.opcionTextoActivo,
          ]}>
            {op}
          </Text>
        </TouchableOpacity>
      ))}
    </Wrapper>
  );
}

export default function NewObservationScreen({ navigation }) {
  // ─── Estado del formulario ───────────────────
  const [titulo, setTitulo]               = useState('');
  const [categoria, setCategoria]         = useState(CATEGORIAS[0]);
  const [condiciones, setCondiciones]     = useState(CONDICIONES[0]);
  const [descripcion, setDescripcion]     = useState('');
  const [duracion, setDuracion]           = useState('');
  const [ubicacionTexto, setUbicacionTexto] = useState('');
  const [lat, setLat]                     = useState(null);
  const [lng, setLng]                     = useState(null);
  const [fotoPath, setFotoPath]           = useState(null);
  const [cargandoGPS, setCargandoGPS]     = useState(false);

  // ─── Capturar GPS ────────────────────────────
  async function capturarGPS() {
    setCargandoGPS(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sin permiso', 'Permite acceso a ubicación o escribe la dirección manualmente.');
        setCargandoGPS(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLat(loc.coords.latitude);
      setLng(loc.coords.longitude);
      setUbicacionTexto(''); // limpiar texto si ya hay GPS
    } catch {
      Alert.alert('Error', 'No se pudo obtener el GPS. Escribe la ubicación manualmente.');
    }
    setCargandoGPS(false);
  }

  // ─── Seleccionar foto ────────────────────────
  async function seleccionarFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sin permiso', 'Permite acceso a fotos para adjuntarlas.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setFotoPath(result.assets[0].uri);
    }
  }

  // ─── Guardar observación ─────────────────────
  function guardar() {
    if (!titulo.trim()) {
      Alert.alert('Campo requerido', 'Escribe un título para la observación.');
      return;
    }
    if (!descripcion.trim()) {
      Alert.alert('Campo requerido', 'Agrega una descripción de lo que observaste.');
      return;
    }

    insertarObservacion({
      titulo:           titulo.trim(),
      fecha_hora:       new Date().toISOString(),
      lat:              lat,
      lng:              lng,
      ubicacion_texto:  ubicacionTexto.trim() || null,
      duracion_seg:     duracion ? parseInt(duracion) : null,
      categoria:        categoria,
      condiciones_cielo: condiciones,
      descripcion:      descripcion.trim(),
      foto_path:        fotoPath,
      audio_path:       null, // ← extensión futura: expo-av para grabar audio
    });

    Alert.alert('✅ Guardado', 'Observación registrada correctamente.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  // ─── UI ──────────────────────────────────────
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.seccionTitle}>🌠 Nueva Observación</Text>

      {/* Título */}
      <Label texto="Título *" />
      <TextInput
        style={styles.input}
        placeholder='Ej: "Halo solar", "Nube lenticular"'
        placeholderTextColor={COLORS.textMuted}
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* Categoría */}
      <Label texto="Categoría *" />
      <Selector
        opciones={CATEGORIAS}
        seleccionado={categoria}
        onChange={setCategoria}
        horizontal
      />

      {/* Condiciones del cielo */}
      <Label texto="Condiciones del cielo *" />
      <Selector
        opciones={CONDICIONES}
        seleccionado={condiciones}
        onChange={setCondiciones}
        horizontal
      />

      {/* Descripción */}
      <Label texto="Descripción *" />
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="¿Qué observaste? Dirección (norte/sur), altura estimada, colores, movimiento..."
        placeholderTextColor={COLORS.textMuted}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Duración */}
      <Label texto="Duración estimada (en segundos, opcional)" />
      <TextInput
        style={styles.input}
        placeholder="Ej: 120"
        placeholderTextColor={COLORS.textMuted}
        value={duracion}
        onChangeText={setDuracion}
        keyboardType="numeric"
      />

      {/* Ubicación */}
      <Label texto="Ubicación (GPS o texto)" />
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btnSecundario, { flex: 1 }]}
          onPress={capturarGPS}
          disabled={cargandoGPS}
        >
          <Ionicons name="location-outline" size={16} color={COLORS.accent} />
          <Text style={styles.btnSecundarioText}>
            {cargandoGPS ? 'Capturando GPS...' : lat ? `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}` : 'Capturar GPS'}
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, { marginTop: 6 }]}
        placeholder="O escribe: sector/municipio/provincia"
        placeholderTextColor={COLORS.textMuted}
        value={ubicacionTexto}
        onChangeText={(v) => { setUbicacionTexto(v); setLat(null); setLng(null); }}
        editable={!lat} // si hay GPS, el texto queda deshabilitado
      />

      {/* Foto */}
      <Label texto="Foto (opcional)" />
      <TouchableOpacity style={styles.btnSecundario} onPress={seleccionarFoto}>
        <Ionicons name="image-outline" size={16} color={COLORS.accent} />
        <Text style={styles.btnSecundarioText}>
          {fotoPath ? 'Cambiar foto' : 'Adjuntar foto de galería'}
        </Text>
      </TouchableOpacity>
      {fotoPath && (
        <Image source={{ uri: fotoPath }} style={styles.preview} />
      )}

      {/* Nota: Audio (extensión futura) */}
      <View style={styles.notaAudio}>
        <Ionicons name="mic-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.notaAudioText}>
          Nota de voz: disponible próximamente (requiere expo-av configurado).
        </Text>
      </View>

      {/* Botón guardar */}
      <TouchableOpacity style={styles.btnGuardar} onPress={guardar}>
        <Ionicons name="save-outline" size={18} color="#fff" />
        <Text style={styles.btnGuardarText}>Guardar Observación</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// Componente auxiliar de etiqueta de campo
function Label({ texto }) {
  return <Text style={styles.label}>{texto}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 16,
    gap: 8,
    paddingBottom: 40,
  },
  seccionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.xl,
    fontWeight: '700',
    marginBottom: 8,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT.sm,
    marginTop: 10,
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.sm,
    color: COLORS.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FONT.md,
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  btnSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  btnSecundarioText: {
    color: COLORS.accent,
    fontSize: FONT.md,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: RADIUS.sm,
    marginTop: 8,
  },
  notaAudio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 10,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderStyle: 'dashed',
  },
  notaAudioText: {
    color: COLORS.textMuted,
    fontSize: FONT.sm,
    flex: 1,
  },
  opcionChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.card,
  },
  opcionActiva: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  opcionText: {
    color: COLORS.textSecondary,
    fontSize: FONT.sm,
  },
  opcionTextoActivo: {
    color: '#fff',
    fontWeight: '600',
  },
  btnGuardar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    marginTop: 20,
  },
  btnGuardarText: {
    color: '#fff',
    fontSize: FONT.lg,
    fontWeight: '700',
  },
});
