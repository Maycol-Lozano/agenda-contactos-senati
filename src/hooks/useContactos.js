<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
import { iniciarDB } from '../db/database.js';
import * as repo from '../db/contactosRepo.js';

export function useContactos() {
  const [listos, setListos] = useState(false);
  const [contactos, setContactos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [error, setError] = useState('');

  const refrescar = useCallback(() => {
    try {
      setContactos(repo.listarContactos({ texto, categoria }));
      setGrupos(repo.listarGrupos());
    } catch (e) {
      console.error('Error al refrescar datos:', e);
    }
  }, [texto, categoria]);

  useEffect(() => {
    iniciarDB()
      .then(() => setListos(true))
      .catch((err) => console.error('Error al iniciar DB:', err));
  }, []);

  useEffect(() => {
    if (listos) refrescar();
  }, [listos, refrescar]);

  const ejecutar = (accion) => {
    try {
      accion();
      setError('');
      refrescar();
      return true;
    } catch (e) {
      setError(
        String(e.message).includes('UNIQUE')
          ? 'Ese dato ya se encuentra registrado.'
          : 'No se pudo procesar la solicitud.'
      );
      return false;
    }
  };

  return {
    listos,
    contactos,
    grupos,
    texto,
    categoria,
    error,
    setTexto,
    setCategoria,
    crear: (c) => ejecutar(() => repo.crearContacto(c)),
    crearGrupo: (nombre) => ejecutar(() => repo.crearGrupo(nombre)),
    actualizar: (id, c) => ejecutar(() => repo.actualizarContacto(id, c)),
    eliminar: (id) => ejecutar(() => repo.eliminarContacto(id)),
    favorito: (id) => ejecutar(() => repo.alternarFavorito(id))
  };
=======
import { useState, useEffect } from 'react';
import * as repo from '../db/contactosRepo.js';

export function useContactos() {
  const [contactos, setContactos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [orden, setOrden] = useState('nombre_asc');
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [contactoEditar, setContactoEditar] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const POR_PAGINA = 5;

  const cargarContactos = () => {
    const lista = repo.obtenerContactos ? repo.obtenerContactos() : repo.listarContactos();
    setContactos(lista);
  };

  useEffect(() => {
    cargarContactos();

    // Sincronizar automáticamente entre pestañas del navegador (E12)
    const handleStorageChange = (e) => {
      if (e.key === 'contactos_senati_db') {
        cargarContactos();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, categoria, orden, soloFavoritos]);

  const guardar = (contacto) => {
    if (contactoEditar) {
      repo.actualizarContacto(contactoEditar.id, contacto);
      setContactoEditar(null);
    } else {
      repo.crearContacto(contacto);
    }
    cargarContactos();
  };

  const importar = (listaImportada) => {
    listaImportada.forEach((c) => {
      if (c.nombre && c.telefono) {
        repo.crearContacto({
          nombre: c.nombre || '',
          apellido: c.apellido || '',
          telefono: c.telefono || '',
          email: c.email || '',
          categoria: c.categoria || 'Personal',
          favorito: c.favorito || false,
          notas: c.notas || '',
          cumple: c.cumple || ''
        });
      }
    });
    cargarContactos();
  };

  const eliminar = (id) => {
    repo.eliminarContacto(id);
    cargarContactos();
  };

  const alternarFav = (id) => {
    repo.alternarFavorito(id);
    cargarContactos();
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoria('Todas');
    setOrden('nombre_asc');
    setSoloFavoritos(false);
  };

  // Búsqueda extendida
  const contactosFiltrados = contactos
    .filter((c) => {
      const q = busqueda.toLowerCase().trim();
      const coincideTexto =
        c.nombre.toLowerCase().includes(q) ||
        c.apellido.toLowerCase().includes(q) ||
        c.telefono.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.notas && c.notas.toLowerCase().includes(q));

      const coincideCat = categoria === 'Todas' || c.categoria === categoria;
      const coincideFav = !soloFavoritos || c.favorito;

      return coincideTexto && coincideCat && coincideFav;
    })
    .sort((a, b) => {
      if (orden === 'nombre_asc') return a.nombre.localeCompare(b.nombre);
      if (orden === 'nombre_desc') return b.nombre.localeCompare(a.nombre);
      if (orden === 'recientes') return b.id - a.id;
      return 0;
    });

  const totalPaginas = Math.ceil(contactosFiltrados.length / POR_PAGINA) || 1;
  const inicio = (paginaActual - 1) * POR_PAGINA;
  const contactosPaginados = contactosFiltrados.slice(inicio, inicio + POR_PAGINA);

  return {
    contactos: contactosPaginados,
    totalContactos: contactosFiltrados.length,
    paginaActual,
    totalPaginas,
    setPaginaActual,
    busqueda,
    setBusqueda,
    categoria,
    setCategoria,
    orden,
    setOrden,
    soloFavoritos,
    setSoloFavoritos,
    limpiarFiltros,
    contactoEditar,
    setContactoEditar,
    guardar,
    importar,
    eliminar,
    alternarFav
  };
>>>>>>> fefcd915a1f91e61a6530f29a0649b35d94de09f
}