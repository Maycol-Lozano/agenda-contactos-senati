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
}