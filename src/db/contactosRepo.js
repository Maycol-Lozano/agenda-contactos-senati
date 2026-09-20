import { obtenerDB, persistir } from './database.js';

// LISTAR GRUPOS (Con inserción de grupos por defecto si está vacía)
export function listarGrupos() {
  const db = obtenerDB();

  let stmt = db.prepare('SELECT * FROM grupos ORDER BY nombre ASC');
  let filas = [];
  while (stmt.step()) filas.push(stmt.getAsObject());
  stmt.free();

  if (filas.length === 0) {
    const base = ['Personal', 'Trabajo', 'SENATI', 'Familia'];
    base.forEach((nombre) => {
      try {
        db.run('INSERT OR IGNORE INTO grupos (nombre) VALUES (?)', [nombre]);
      } catch (e) {
        console.warn('Error insertando grupo base:', e);
      }
    });
    persistir();

    stmt = db.prepare('SELECT * FROM grupos ORDER BY nombre ASC');
    filas = [];
    while (stmt.step()) filas.push(stmt.getAsObject());
    stmt.free();
  }

  return filas;
}

// CREAR GRUPO
export function crearGrupo(nombre, color = '#3b82f6') {
  obtenerDB().run('INSERT INTO grupos (nombre, color) VALUES (?, ?)', [nombre.trim(), color]);
  persistir();
}

// LISTAR CONTACTOS CON JOIN A GRUPOS
export function listarContactos({ texto = '', categoria = 'Todas' } = {}) {
  const sql = `
    SELECT c.*, g.nombre AS grupo_nombre, g.color AS grupo_color
    FROM contactos c
    LEFT JOIN grupos g ON c.grupo_id = g.id
    WHERE (c.nombre LIKE $t OR c.apellido LIKE $t OR c.telefono LIKE $t)
    AND ($c = 'Todas' OR c.categoria = $c)
    ORDER BY c.favorito DESC, c.nombre COLLATE NOCASE ASC;
  `;
  const stmt = obtenerDB().prepare(sql);
  stmt.bind({ '$t': `%${texto}%`, '$c': categoria });
  const filas = [];
  while (stmt.step()) filas.push(stmt.getAsObject());
  stmt.free();
  return filas;
}

// CREAR CONTACTO
export function crearContacto(c) {
  obtenerDB().run(
    `INSERT INTO contactos (nombre, apellido, telefono, email, categoria, favorito, notas, cumple, grupo_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      c.nombre.trim(),
      c.apellido ? c.apellido.trim() : '',
      c.telefono.trim(),
      c.email ? c.email.trim() : '',
      c.categoria || 'Personal',
      c.favorito ? 1 : 0,
      c.notas ? c.notas.trim() : '',
      c.cumple || '',
      c.grupo_id || null
    ]
  );
  persistir();
}

// ACTUALIZAR CONTACTO
export function actualizarContacto(id, c) {
  obtenerDB().run(
    `UPDATE contactos 
     SET nombre = ?, apellido = ?, telefono = ?, email = ?, categoria = ?, favorito = ?, notas = ?, cumple = ?, grupo_id = ?
     WHERE id = ?`,
    [
      c.nombre,
      c.apellido,
      c.telefono,
      c.email,
      c.categoria,
      c.favorito ? 1 : 0,
      c.notas,
      c.cumple,
      c.grupo_id || null,
      id
    ]
  );
  persistir();
}

// ELIMINAR CONTACTO
export function eliminarContacto(id) {
  obtenerDB().run('DELETE FROM contactos WHERE id = ?', [id]);
  persistir();
}

// ALTERNAR FAVORITO
export function alternarFavorito(id) {
  obtenerDB().run(
    'UPDATE contactos SET favorito = CASE favorito WHEN 1 THEN 0 ELSE 1 END WHERE id = ?',
    [id]
  );
  persistir();
}

// ESTADÍSTICAS POR CATEGORÍA
export function resumenPorCategoria() {
  const res = obtenerDB().exec(
    'SELECT categoria, COUNT(*) AS total FROM contactos GROUP BY categoria'
  );
  if (res.length === 0) return [];
  return res[0].values.map(([categoria, total]) => ({ categoria, total }));
}

// VERIFICAR DUPLICADOS
export function verificarDuplicadoIA(nombre, telefono) {
  const stmt = obtenerDB().prepare('SELECT * FROM contactos');
  const contactos = [];
  while (stmt.step()) contactos.push(stmt.getAsObject());
  stmt.free();

  const normalizar = (txt) =>
    (txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  const nomNorm = normalizar(nombre);
  const telNorm = (telefono || '').replace(/\D/g, '');

  for (const c of contactos) {
    const cNom = normalizar(`${c.nombre} ${c.apellido}`);
    const cTel = (c.telefono || '').replace(/\D/g, '');

    if (telNorm && cTel && (telNorm.endsWith(cTel) || cTel.endsWith(telNorm))) {
      return c;
    }

    if (nomNorm && cNom && (nomNorm.includes(cNom) || cNom.includes(nomNorm))) {
      return c;
    }
  }

  return null;
}