import { obtenerDB, persistir } from './database.js';

export function listarContactos({ texto = '', categoria = 'Todas' } = {}) {
  const db = obtenerDB();
  let query = `
    SELECT c.*, g.nombre AS grupo_nombre, g.color AS grupo_color
    FROM contactos c
    LEFT JOIN grupos g ON c.grupo_id = g.id
    WHERE 1=1
  `;
  const params = [];

  if (texto.trim() !== '') {
    query += ` AND (c.nombre LIKE ? OR c.apellido LIKE ? OR c.telefono LIKE ? OR c.email LIKE ? OR c.notas LIKE ?)`;
    const q = `%${texto.trim()}%`;
    params.push(q, q, q, q, q);
  }

  if (categoria !== 'Todas') {
    query += ` AND (c.categoria = ? OR g.nombre = ?)`;
    params.push(categoria, categoria);
  }

  query += ` ORDER BY c.nombre ASC`;

  const stmt = db.prepare(query);
  if (params.length > 0) stmt.bind(params);

  const lista = [];
  while (stmt.step()) {
    lista.push(stmt.getAsObject());
  }
  stmt.free();
  return lista;
}

export function crearContacto(c) {
  const db = obtenerDB();
  const sql = `
    INSERT INTO contactos (nombre, apellido, telefono, email, categoria, grupo_id, favorito, notas, cumple)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [
    c.nombre,
    c.apellido || '',
    c.telefono,
    c.email || null,
    c.categoria || 'Personal',
    c.grupo_id || null,
    c.favorito ? 1 : 0,
    c.notas || null,
    c.cumple || null
  ]);
  persistir();
}

export function actualizarContacto(id, c) {
  const db = obtenerDB();
  const sql = `
    UPDATE contactos 
    SET nombre = ?, apellido = ?, telefono = ?, email = ?, categoria = ?, grupo_id = ?, favorito = ?, notas = ?, cumple = ?
    WHERE id = ?
  `;
  db.run(sql, [
    c.nombre,
    c.apellido || '',
    c.telefono,
    c.email || null,
    c.categoria || 'Personal',
    c.grupo_id || null,
    c.favorito ? 1 : 0,
    c.notas || null,
    c.cumple || null,
    id
  ]);
  persistir();
}

export function eliminarContacto(id) {
  const db = obtenerDB();
  db.run(`DELETE FROM contactos WHERE id = ?`, [id]);
  persistir();
}

export function alternarFavorito(id) {
  const db = obtenerDB();
  db.run(`UPDATE contactos SET favorito = CASE WHEN favorito = 1 THEN 0 ELSE 1 END WHERE id = ?`, [id]);
  persistir();
}

export function listarGrupos() {
  const db = obtenerDB();
  const stmt = db.prepare(`SELECT * FROM grupos ORDER BY nombre ASC`);
  const lista = [];
  while (stmt.step()) {
    lista.push(stmt.getAsObject());
  }
  stmt.free();
  return lista;
}

export function crearGrupo(nombre, color = '#3b82f6') {
  const db = obtenerDB();
  db.run(`INSERT INTO grupos (nombre, color) VALUES (?, ?)`, [nombre, color]);
  persistir();
}

export function obtenerEstadisticas() {
  const db = obtenerDB();
  const total = db.exec(`SELECT COUNT(*) as count FROM contactos`)[0]?.values[0][0] || 0;
  const favs = db.exec(`SELECT COUNT(*) as count FROM contactos WHERE favorito = 1`)[0]?.values[0][0] || 0;
  
  return { total, favoritos: favs };
}