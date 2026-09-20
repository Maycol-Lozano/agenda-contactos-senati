<<<<<<< HEAD
import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { ESQUEMA } from './esquema.js';

const CLAVE = 'agenda_contactos_v1';
let db = null;

const aBase64 = (bytes) => btoa(String.fromCharCode(...bytes));
const aBytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

export async function iniciarDB() {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  let guardada = null;
  try {
    guardada = localStorage.getItem(CLAVE);
  } catch (e) {
    console.warn('Sin acceso a localStorage', e);
  }
  db = guardada ? new SQL.Database(aBytes(guardada)) : new SQL.Database();
  db.run(ESQUEMA);
  persistir();
  return db;
}

export function obtenerDB() {
  if (!db) throw new Error('Llama a iniciarDB() antes de consultar.');
  return db;
}

export function persistir() {
  try {
    localStorage.getItem(CLAVE);
    localStorage.setItem(CLAVE, aBase64(db.export()));
  } catch (e) {
    console.warn('No se pudo guardar la base', e);
  }
}

// EXPORTAR BASE DE DATOS REAL (.db)
export function exportarBaseDatos() {
  const base = obtenerDB();
  const data = base.export(); // Extrae los bytes del archivo .db
  const blob = new Blob([data], { type: 'application/octet-stream' });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'agenda.db';
  a.click();
  URL.revokeObjectURL(url);
}

// IMPORTAR BASE DE DATOS REAL (.db)
export async function importarBaseDatos(archivo) {
  const buffer = await archivo.arrayBuffer();
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  
  // Reemplazamos la instancia de SQLite con el archivo cargado
  db = new SQL.Database(new Uint8Array(buffer));
  persistir(); // Persistimos en localStorage
  window.location.reload(); // Recargamos para refrescar el estado de React
=======
import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { ESQUEMA } from './esquema.js';

const CLAVE = 'agenda_contactos_v1';
let db = null;

const aBase64 = (bytes) => btoa(String.fromCharCode(...bytes));
const aBytes = (b64) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

export async function iniciarDB() {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  let guardada = null;
  try { 
    guardada = localStorage.getItem(CLAVE); 
  } catch (e) { 
    console.warn('Sin acceso a localStorage', e); 
  }

  db = guardada ? new SQL.Database(aBytes(guardada)) : new SQL.Database();
  db.run(ESQUEMA);
  persistir();
  return db;
}

export function obtenerDB() {
  if (!db) throw new Error('Llama a iniciarDB() antes de consultar.');
  return db;
}

export function persistir() {
  try { 
    localStorage.setItem(CLAVE, aBase64(db.export())); 
  } catch (e) { 
    console.warn('No se pudo guardar la base', e); 
  }
>>>>>>> fefcd915a1f91e61a6530f29a0649b35d94de09f
}