/**
 * AboutScreen.js
 * Pantalla "Acerca de" con el perfil del observador.
 * Se guarda localmente y persiste entre sesiones.
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Image, ScrollView, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { guardarPerfil, obtenerPerfil } from '../database';
import { COLORS, FONT, RADIUS } from '../theme';

export default function AboutScreen() {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre]     = useState('');
  const [apellido, setApellido] = useState('');
  const [matricula, setMatricula] = useState('');
  const [fotoPath, setFotoPath] = useState(null);
  const [frase, setFrase]       = useState('');

  // Cargar perfil guardado al iniciar
  useEffect(() => {
    const perfil = obtenerPerfil();
    if (perfil) {
      setNombre(perfil.nombre ?? '');
      setApellido(perfil.apellido ?? '');
      setMatricula(perfil.matricula ?? '');
      setFotoPath(perfil.foto_path ?? null);
      setFrase(perfil.frase ?? '');
    } else {
      // Primera vez: activar edición automáticamente
      setEditando(true);
    }
  }, []);

  // Seleccionar foto de perfil
  async function seleccionarFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sin permiso', 'Permite acceso a la galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      allowsEditing: true,
      aspect: [1, 1], // recorte cuadrado para foto de perfil
    });
    if (!result.canceled) {
      setFotoPath(result.assets[0].uri);
    }
  }

  // Guardar perfil
  function guardar() {
    if (!nombre.trim() || !apellido.trim() || !matricula.trim()) {
      Alert.alert('Campos requeridos', 'Nombre, apellido y matrícula son obligatorios.');
      return;
    }
    guardarPerfil({
      nombre:    nombre.trim(),
      apellido:  apellido.trim(),
      matricula: matricula.trim(),
      foto_path: fotoPath,
      frase:     frase.trim(),
    });
    setEditando(false);
    Alert.alert('✅ Perfil guardado');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Foto de perfil ── */}
      <TouchableOpacity
        onPress={editando ? seleccionarFoto : undefined}
        style={styles.fotoWrapper}
        activeOpacity={editando ? 0.7 : 1}
      >
        {fotoPath ? (
          <Image source={{ uri: fotoPath }} style={styles.foto} />
        ) : (
          <View style={styles.fotoPlaceholder}>
            {/*
              📸 COLOCA TU FOTO AQUÍ:
              Cambia esta parte por:
              <Image source={require('../../assets/mi-foto.jpg')} style={styles.foto} />
            */}
            <Ionicons name="person-outline" size={54} color={COLORS.textMuted} />
          </View>
        )}
        {editando && (
          <View style={styles.editBadge}>
            <Ionicons name="camera-outline" size={14} color="#fff" />
          </View>
        )}
      </TouchableOpacity>

      {/* ── Nombre y matrícula ── */}
      {editando ? (
        <View style={styles.formBox}>
          <Campo label="Nombre" value={nombre} onChange={setNombre} placeholder="Tu nombre" />
          <Campo label="Apellido" value={apellido} onChange={setApellido} placeholder="Tu apellido" />
          <Campo label="Matrícula" value={matricula} onChange={setMatricula} placeholder="Ej: 20241234" />
          <Campo
            label="Frase motivadora"
            value={frase}
            onChange={setFrase}
            placeholder="Una frase sobre la curiosidad científica..."
            multiline
          />
        </View>
      ) : (
        <View style={styles.perfilBox}>
          <Text style={styles.nombre}>{nombre} {apellido}</Text>
          <Text style={styles.matricula}>🆔 {matricula}</Text>
          {frase ? (
            <View style={styles.fraseBox}>
              <Ionicons name="chatbubble-ellipses-outline" size={14} color={COLORS.accentAlt} />
              <Text style={styles.frase}>"{frase}"</Text>
            </View>
          ) : null}
        </View>
      )}

      {/* ── Botones ── */}
      {editando ? (
        <TouchableOpacity style={styles.btnGuardar} onPress={guardar}>
          <Ionicons name="save-outline" size={18} color="#fff" />
          <Text style={styles.btnGuardarText}>Guardar Perfil</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.btnEditar} onPress={() => setEditando(true)}>
          <Ionicons name="pencil-outline" size={16} color={COLORS.accent} />
          <Text style={styles.btnEditarText}>Editar Perfil</Text>
        </TouchableOpacity>
      )}

      {/* ── Sobre la app ── */}
      <View style={styles.sobreBox}>
        <Text style={styles.sobreTitle}>🌌 Sobre CieloObs</Text>
        <Text style={styles.sobreText}>
          Aplicación desarrollada para observadores del cielo en República Dominicana.{'\n\n'}
          Registra fenómenos visibles: halos solares, lluvias de meteoros, nubes inusuales,
          aves migratorias, satélites y más.{'\n\n'}
          Funciona 100% sin conexión a internet.
        </Text>
        <Text style={styles.version}>v1.0.0 · SDK Expo 52</Text>
      </View>

    </ScrollView>
  );
}

// Componente auxiliar de campo de texto
function Campo({ label, value, onChange, placeholder, multiline }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    gap: 16,
    paddingBottom: 40,
  },

  // Foto
  fotoWrapper: {
    position: 'relative',
    marginTop: 8,
  },
  foto: {
    width: 120,
    height: 120,
    borderRadius: RADIUS.full,
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
  fotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    padding: 5,
  },

  // Perfil modo lectura
  perfilBox: {
    alignItems: 'center',
    gap: 6,
  },
  nombre: {
    color: COLORS.textPrimary,
    fontSize: FONT.xxl,
    fontWeight: '700',
    textAlign: 'center',
  },
  matricula: {
    color: COLORS.textSecondary,
    fontSize: FONT.md,
  },
  fraseBox: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
    maxWidth: 280,
    marginTop: 4,
  },
  frase: {
    color: COLORS.accentAlt,
    fontSize: FONT.md,
    fontStyle: 'italic',
    flex: 1,
    textAlign: 'center',
  },

  // Formulario edición
  formBox: {
    width: '100%',
    gap: 10,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT.sm,
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
  inputMulti: {
    minHeight: 80,
    paddingTop: 10,
  },

  // Botones
  btnGuardar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    paddingHorizontal: 32,
    width: '100%',
  },
  btnGuardarText: {
    color: '#fff',
    fontSize: FONT.lg,
    fontWeight: '700',
  },
  btnEditar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  btnEditarText: {
    color: COLORS.accent,
    fontSize: FONT.md,
    fontWeight: '500',
  },

  // Sobre la app
  sobreBox: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 16,
    gap: 8,
  },
  sobreTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.lg,
    fontWeight: '700',
  },
  sobreText: {
    color: COLORS.textSecondary,
    fontSize: FONT.md,
    lineHeight: 22,
  },
  version: {
    color: COLORS.textMuted,
    fontSize: FONT.sm,
    textAlign: 'right',
  },
});
