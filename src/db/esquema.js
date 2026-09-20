export const ESQUEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS grupos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3b82f6'
);

CREATE TABLE IF NOT EXISTS contactos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL DEFAULT '',
  telefono TEXT NOT NULL UNIQUE,
  email TEXT,
  categoria TEXT DEFAULT 'Personal',
  grupo_id INTEGER,
  favorito INTEGER NOT NULL DEFAULT 0 CHECK (favorito IN (0, 1)),
  notas TEXT,
  cumple TEXT,
  creado_en TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_contactos_nombre ON contactos (nombre);

-- Insertar los grupos base si no existen aún
INSERT OR IGNORE INTO grupos (id, nombre, color) VALUES (1, 'Personal', '#3b82f6');
INSERT OR IGNORE INTO grupos (id, nombre, color) VALUES (2, 'Trabajo', '#10b981');
INSERT OR IGNORE INTO grupos (id, nombre, color) VALUES (3, 'SENATI', '#f59e0b');
INSERT OR IGNORE INTO grupos (id, nombre, color) VALUES (4, 'Familia', '#ef4444');
`;