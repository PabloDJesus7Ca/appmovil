/**
 * database.js
 * Maneja toda la lógica de SQLite local (funciona 100% offline).
 * Se crean las tablas al iniciar la app si no existen.
 */

import * as SQLite from 'expo-sqlite'

// Abrir (o crear) la base de datos local
const db = SQLite.openDatabaseSync('observaciones.db')

// ─────────────────────────────────────────────
// INICIALIZAR TABLAS
// ─────────────────────────────────────────────
export function initDB() {
	// Tabla de observaciones
	db.execSync(`
    CREATE TABLE IF NOT EXISTS observacion (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo          TEXT    NOT NULL,
      fecha_hora      TEXT    NOT NULL,
      lat             REAL,
      lng             REAL,
      ubicacion_texto TEXT,
      duracion_seg    INTEGER,
      categoria       TEXT    NOT NULL,
      condiciones_cielo TEXT  NOT NULL,
      descripcion     TEXT    NOT NULL,
      foto_path       TEXT,
      audio_path      TEXT,
      creado_en       TEXT    NOT NULL
    );
  `)

	// Tabla de perfil del observador (solo 1 fila)
	db.execSync(`
    CREATE TABLE IF NOT EXISTS perfil (
      id        INTEGER PRIMARY KEY,
      nombre    TEXT,
      apellido  TEXT,
      matricula TEXT,
      foto_path TEXT,
      frase     TEXT
    );
  `)
}

// ─────────────────────────────────────────────
// OBSERVACIONES — CRUD
// ─────────────────────────────────────────────

/** Insertar una nueva observación */
export function insertarObservacion(obs) {
	const ahora = new Date().toISOString()
	const resultado = db.runSync(
		`INSERT INTO observacion
      (titulo, fecha_hora, lat, lng, ubicacion_texto, duracion_seg,
       categoria, condiciones_cielo, descripcion, foto_path, audio_path, creado_en)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			obs.titulo,
			obs.fecha_hora || ahora,
			obs.lat ?? null,
			obs.lng ?? null,
			obs.ubicacion_texto ?? null,
			obs.duracion_seg ?? null,
			obs.categoria,
			obs.condiciones_cielo,
			obs.descripcion,
			obs.foto_path ?? null,
			obs.audio_path ?? null,
			ahora,
		]
	)
	return resultado.lastInsertRowId
}

/** Obtener todas las observaciones (más reciente primero) */
export function obtenerObservaciones() {
	return db.getAllSync(`SELECT * FROM observacion ORDER BY creado_en DESC`)
}

/** Obtener una observación por ID */
export function obtenerObservacionPorId(id) {
	return db.getFirstSync(`SELECT * FROM observacion WHERE id = ?`, [id])
}

/** Eliminar una observación por ID */
export function eliminarObservacion(id) {
	db.runSync(`DELETE FROM observacion WHERE id = ?`, [id])
}

/** Eliminar TODAS las observaciones (botón "Borrar Todo") */
export function borrarTodo() {
	db.runSync(`DELETE FROM observacion`)
}

// ─────────────────────────────────────────────
// PERFIL — Guardar y leer
// ─────────────────────────────────────────────

/** Guardar o actualizar el perfil del observador */
export function guardarPerfil(perfil) {
	// Upsert: si ya existe (id=1) actualiza, si no, inserta
	db.runSync(
		`INSERT INTO perfil (id, nombre, apellido, matricula, foto_path, frase)
     VALUES (1, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       nombre    = excluded.nombre,
       apellido  = excluded.apellido,
       matricula = excluded.matricula,
       foto_path = excluded.foto_path,
       frase     = excluded.frase`,
		[
			perfil.nombre,
			perfil.apellido,
			perfil.matricula,
			perfil.foto_path ?? null,
			perfil.frase,
		]
	)
}

/** Leer el perfil guardado */
export function obtenerPerfil() {
	return db.getFirstSync(`SELECT * FROM perfil WHERE id = 1`)
}
