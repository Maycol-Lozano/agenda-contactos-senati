<<<<<<< HEAD
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
=======
const KEY = 'contactos_senati_db';

export function listarContactos() {
  const data = localStorage.getItem(KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error al parsear contactos de localStorage', e);
    return [];
  }
}

export function obtenerContactos() {
  return listarContactos();
}

export function guardarContactos(contactos) {
  localStorage.setItem(KEY, JSON.stringify(contactos));
}

export function crearContacto(contacto) {
  const contactos = listarContactos();
  const nuevoContacto = {
    ...contacto,
    id: Date.now()
  };
  contactos.push(nuevoContacto);
  guardarContactos(contactos);
  return nuevoContacto;
}

export function actualizarContacto(id, datosActualizados) {
  let contactos = listarContactos();
  contactos = contactos.map((c) =>
    c.id === id ? { ...c, ...datosActualizados } : c
  );
  guardarContactos(contactos);
}

export function eliminarContacto(id) {
  let contactos = listarContactos();
  contactos = contactos.filter((c) => c.id !== id);
  guardarContactos(contactos);
}

export function alternarFavorito(id) {
  let contactos = listarContactos();
  contactos = contactos.map((c) =>
    c.id === id ? { ...c, favorito: !c.favorito } : c
  );
  guardarContactos(contactos);
}
// Reto IA / Asistente: Detección inteligente de duplicados
export function verificarDuplicadoIA(nombre, telefono) {
  const contactos = listarContactos();
  const telLimpio = telefono.replace(/\D/g, '');

  const duplicado = contactos.find((c) => {
    const coincidenciaNombre = c.nombre.toLowerCase().trim() === nombre.toLowerCase().trim();
    const coincidenciaTel = c.telefono.replace(/\D/g, '') === telLimpio;
    return coincidenciaNombre || coincidenciaTel;
  });

  if (duplicado) {
    return ` Posible duplicado detectado: Ya existe un contacto con el nombre "${duplicado.nombre}" o número "${duplicado.telefono}".`;
  }
  return null;
>>>>>>> fefcd915a1f91e61a6530f29a0649b35d94de09f
}