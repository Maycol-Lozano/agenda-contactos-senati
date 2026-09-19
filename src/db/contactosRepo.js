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
}